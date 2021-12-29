// import Link from 'next/link';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';

const UsersPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const usersQuery = trpc.useQuery(['user.all']);
  const addUser = trpc.useMutation('user.add', {
    async onSuccess() {
      // refetches users after a user is added
      await utils.invalidateQueries(['user.all']);
    },
  });

  return (
    <>
      <h1>This is a list of users</h1>

      <h2>Users {usersQuery.status === 'loading' && '(loading...)'}</h2>
      {usersQuery.data?.map((item) => (
        <div key={item.id}>
          <h3>
            Name: {item.firstName} {item.lastName} ({item.email})
          </h3>

          <span>Role: {item.role}</span>
        </div>
      ))}

      <hr />

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const $email: HTMLInputElement = (e as any).target.elements.email;
          const $password: HTMLInputElement = (e as any).target.elements
            .password;
          const $firstName: HTMLInputElement = (e as any).target.elements
            .firstName;
          const $lastName: HTMLInputElement = (e as any).target.elements
            .lastName;
          const input = {
            email: $email.value,
            password: $password.value,
            firstName: $firstName.value,
            lastName: $lastName.value,
          };

          try {
            await addUser.mutateAsync(input);

            $email.value = '';
            $password.value = '';
            $firstName.value = '';
            $lastName.value = '';
          } catch {}
        }}
      >
        <label htmlFor="email">Email:</label>
        <br />
        <input
          id="email"
          name="email"
          type="email"
          disabled={addUser.isLoading}
        />

        <br />
        <label htmlFor="password">Password:</label>
        <br />
        <input
          id="password"
          name="password"
          type="password"
          disabled={addUser.isLoading}
        />

        <br />
        <label htmlFor="firstName">First name:</label>
        <br />
        <input
          id="firstName"
          name="firstName"
          type="text"
          disabled={addUser.isLoading}
        />

        <br />
        <label htmlFor="lastName">Last name:</label>
        <br />
        <input
          id="lastName"
          name="lastName"
          type="text"
          disabled={addUser.isLoading}
        />

        <br />
        <br />
        <input type="submit" disabled={addUser.isLoading} />
        {addUser.error && (
          <p style={{ color: 'red' }}>{addUser.error.message}</p>
        )}
      </form>
    </>
  );
};

export default UsersPage;
