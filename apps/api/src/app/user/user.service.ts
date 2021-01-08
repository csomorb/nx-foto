import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './user-login.dto';
import { CreateUserDto } from './user.create.dto';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)    
        private readonly userRepo: Repository<UserEntity>, 
    ) {}
    
    toUserDto(data: UserEntity): UserDto {  
        const { id, username, email, role } = data;
        const userDto: UserDto = { id, username, email, role };
        return userDto;
    };    

    async findOne(options?: object): Promise<UserDto> {
        const user =  await this.userRepo.findOne(options);    
        return this.toUserDto(user);  
    }   

    async comparePasswords(userPassword, currentPassword){
        return await bcrypt.compare(currentPassword, userPassword);
    };
    
    async findByLogin({ username, password }: LoginUserDto): Promise<UserDto> {    
        const user = await this.userRepo.findOne({ where: { username } });
        
        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);    
        }
        
        // compare passwords    
        const areEqual = await this.comparePasswords(user.password, password);
        
        if (!areEqual) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);    
        }
        
        return this.toUserDto(user);  
    }

    async findByPayload({ username }: any): Promise<UserDto> {
        return await this.findOne({ 
            where:  { username } });  
    }

    async create(userDto: CreateUserDto): Promise<UserDto> {    
        const { username, password, email, role } = userDto;
        
        // check if the user exists in the db    
        const userInDb = await this.userRepo.findOne({ 
            where: { username } 
        });
        if (userInDb) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);    
        }
        
        const user: UserEntity = await this.userRepo.create({ username, password, email, role });
        await this.userRepo.save(user);
        return this.toUserDto(user);  
    }
}
