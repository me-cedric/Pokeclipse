import type { Prisma, User } from "../../generated/prisma/index";
import prisma from "../db";

export class UserService {
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async listUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
}
