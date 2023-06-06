import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async register(authDto: AuthDto) {
    try {
      const hashedPassword = await argon.hash(authDto.password);
      const user = await this.prismaService.user.create({
        data: {
          email: authDto.email,
          hashedPassword: hashedPassword,
          firstName: '',
          lastName: '',
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Error in credentials');
      }
    }
  }
  async login(authDto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('user not found');
    }
    const passwordMatched = await argon.verify(
      user.hashedPassword,
      authDto.password,
    );
    if (!passwordMatched) {
      throw new ForbiddenException('Incorrect password');
    }
    delete user.hashedPassword;
    return user;
  }
}
