/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */

import { Account, Category, PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firstPostId = '5c03994c-fc16-47e0-bd02-d218a370a078';
  await prisma.post.upsert({
    where: {
      id: firstPostId,
    },
    create: {
      id: firstPostId,
      title: 'First Post',
      text: 'This is an example post generated from `prisma/seed.ts`',
    },
    update: {},
  });

  const users = await addUsers();
  const categories = await createCategories(users);
  const accounts = await createAccounts(users);
  await createTransactions(users, categories, accounts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function addUsers() {
  const ids = [
    'da9899dc-6af9-4cc7-a203-e9413236ee12',
    '6858754b-cd41-4e82-983f-15f8bd3c7723',
  ];
  const user1 = await prisma.user.upsert({
    where: { id: ids[0] },
    create: {
      id: ids[0],
      email: 'seed.user.1@test.com',
      password: '12345678',
      firstName: 'Seed',
      lastName: 'User 1',
      role: 'ADMIN',
    },
    update: {},
  });
  const user2 = await prisma.user.upsert({
    where: { id: ids[1] },
    create: {
      id: ids[1],
      email: 'seed.user.2@test.com',
      password: '12345678',
      firstName: 'Seed',
      lastName: 'User 2',
    },
    update: {},
  });

  return [user1, user2];
}

async function createCategories(users: User[]) {
  const ids = [
    '16030344-7d3b-4f01-ae91-aa8bc8ff839e',
    '91a28723-2ad2-4d13-89fa-66eb3531fc37',
    '83bba05c-52e0-42e9-a024-494e97c61cbf',
  ];
  const c1 = await prisma.category.upsert({
    where: { id: ids[0] },
    create: {
      id: ids[0],
      name: 'Transportation',
      color: 'blue',
      catType: 'EXPENSE',
      userId: users[0].id,
    },
    update: {},
  });
  const c2 = await prisma.category.upsert({
    where: { id: ids[1] },
    create: {
      id: ids[1],
      name: 'Food',
      color: 'green',
      catType: 'EXPENSE',
      userId: users[0].id,
    },
    update: {},
  });
  const c3 = await prisma.category.upsert({
    where: { id: ids[2] },
    create: {
      id: ids[2],
      name: 'Health',
      color: 'yellow',
      catType: 'EXPENSE',
      userId: users[1].id,
    },
    update: {},
  });

  return [c1, c2, c3];
}

async function createAccounts(users: User[]) {
  const ids = [
    '7c2df485-be43-4b58-be50-793338c88c1b',
    '822915a7-6298-4d9f-ab35-f1a6403a4361',
  ];
  const a1 = await prisma.account.upsert({
    where: {
      id: ids[0],
    },
    create: {
      id: ids[0],
      name: 'Account 1',
      color: 'green',
      accType: 'CHECKING',
      userId: users[0].id,
    },
    update: {},
  });
  const a2 = await prisma.account.upsert({
    where: {
      id: ids[1],
    },
    create: {
      id: ids[1],
      name: 'Account 2',
      color: 'gray',
      accType: 'CHECKING',
      userId: users[1].id,
    },
    update: {},
  });

  return [a1, a2];
}

async function createTransactions(
  users: User[],
  categories: Category[],
  accounts: Account[],
) {
  const ids = [
    'c72b6cb9-f369-43ee-af1f-122d4563eca9',
    'e7415c5c-dac9-4075-a89b-586aa2df185a',
  ];

  await prisma.transaction.upsert({
    where: { id: ids[0] },
    create: {
      id: ids[0],
      title: 'First transaction',
      note: '',
      value: 150,
      txType: 'EXPENSE',
      paid: false,
      userId: users[0].id,
      accountId: accounts[0].id,
      categoryId: categories[0].id,
    },
    update: {},
  });

  await prisma.transaction.upsert({
    where: { id: ids[1] },
    create: {
      id: ids[1],
      title: 'Second transaction',
      note: '',
      value: 15,
      txType: 'EXPENSE',
      paid: true,
      userId: users[0].id,
      accountId: accounts[0].id,
      categoryId: categories[0].id,
    },
    update: {},
  });
}
