import server from '../../src/server';
import { Server } from 'hapi';

export default async (): Promise<Server> => await server();
