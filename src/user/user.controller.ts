import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./entity/user.entity";
import { UserResponseInterface } from "./types/userResponseInterface";
import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post("users")
  @UsePipes(new ValidationPipe())
  async createUser(@Body("user") createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }
}