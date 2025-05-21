import { PrismaClient } from "./generated/prisma";

//creating a prisma client which can be imported by another folders 
export const prismaClient = new PrismaClient;