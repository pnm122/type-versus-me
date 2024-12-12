import CustomSocket from "@/types/CustomSocket";

export function mockSocket(id = 'test') {
  return {
    id,
    join: jest.fn() as CustomSocket['join'],
    emit: jest.fn() as CustomSocket['emit']
  } as CustomSocket
}