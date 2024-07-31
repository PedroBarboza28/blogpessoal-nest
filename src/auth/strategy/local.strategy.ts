import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from '../service/auth.service';
import { Strategy } from 'passport-local';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super({
            usernameField: 'usuario',
            passwordField: 'senha',
        });
    }

    async validate(username: string, password: string): Promise<any> {

        const user = await this.authService.validateUser(username, password);
        if (!user) {

            throw new UnauthorizedException();

        }
        return user;
    }

}



