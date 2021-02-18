import { Service, Inject } from "typedi";
import { Repository } from "typeorm";
import jwt from "jsonwebtoken";
import {
  hashPersonalMessage,
  ECDSASignature,
  ecrecover,
  publicToAddress,
  bufferToHex,
} from "ethereumjs-util";
import randomstring from "randomstring";
import config from "../config";
import { IUserInputDTO, IUser } from "../interfaces/IUser";
import { User } from "../entity/User";
// import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
// import events from '../subscribers/events';

@Service()
export default class AuthService {
  constructor(
    @Inject("userRepository") private userRepository: Repository<User>,
    @Inject("logger") private logger
  ) {}
  public async SignUp(userInputDTO: IUserInputDTO): Promise<IUser | any> {
    try {
      const { pubAddr } = userInputDTO;
      const userRecord = await this.userRepository.findOne({ pubAddr });
      if (userRecord) throw new Error("User cannot be created");
      const nonce: any = this.generateNonce();
      return await this.userRepository.save({
        pubAddr,
        nonce,
      });

      // const salt = randomBytes(32);
      // this.logger.silly("Hashing password");
      // const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      // this.logger.silly("Creating user db record");
      // const userRecord = await this.userModel.create({
      //   ...userInputDTO,
      //   salt: salt.toString("hex"),
      //   password: hashedPassword,
      // });
      // this.logger.silly("Generating JWT");
      // const token = this.generateToken(userRecord);
      // if (!userRecord) {
      //   throw new Error("User cannot be created");
      // }
      // this.logger.silly("Sending welcome email");
      // /**
      //  * @TODO This is not the best way to deal with this
      //  * There should exist a 'Mapper' layer
      //  * that transforms data from layer to layer
      //  * but that's too over-engineering for now
      //  */
      // const user = userRecord.toObject();
      // Reflect.deleteProperty(user, "password");
      // Reflect.deleteProperty(user, "salt");
    } catch (e) {
      this.logger.error(e);
      return e;
    }
  }
  // Promise<{ user: IUser; token: string }>
  public async SignIn(userInputDTO: IUserInputDTO): Promise<any> {
    try {
      const { pubAddr, signedNonce: signature } = userInputDTO;
      const userRecord = await this.userRepository.findOne({ pubAddr });
      if (!userRecord) {
        throw new Error("Invalid");
      }
      const validSignature = this.verifyNonce(
        signature,
        userRecord.nonce,
        userRecord.pubAddr
      );
    } catch (e) {
      this.logger.error(e);
      return e;
    }
    //   const userRecord = await this.userModel.findOne({ email });
    // if (!userRecord) {
    //   throw new Error("User not registered");
    // }
    //   /**
    //    * We use verify from argon2 to prevent 'timing based' attacks
    //    */
    //   this.logger.silly("Checking password");
    //   const validPassword = await argon2.verify(userRecord.password, password);
    //   if (validPassword) {
    //     this.logger.silly("Password is valid!");
    //     this.logger.silly("Generating JWT");
    //     const token = this.generateToken(userRecord);
    //     const user = userRecord.toObject();
    //     Reflect.deleteProperty(user, "password");
    //     Reflect.deleteProperty(user, "salt");
    //     /**
    //      * Easy as pie, you don't need passport.js anymore :)
    //      */
    //     return { user, token };
    //   } else {
    //     throw new Error("Invalid Password");
    //   }
  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }

  private generateNonce(): String {
    return randomstring.generate();
  }

  private verifyNonce(
    signature: ECDSASignature,
    msg: string,
    pubAddr: string
  ): boolean {
    const msgHash = hashPersonalMessage(Buffer.from(msg));
    const publicKey = ecrecover(msgHash, signature.v, signature.r, signature.s);
    const addressBuffer = publicToAddress(publicKey);
    const address = bufferToHex(addressBuffer);
    return "0x" + pubAddr === address;
  }
}

const msg = "dinosaur";
