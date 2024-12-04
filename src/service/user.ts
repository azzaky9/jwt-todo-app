import { User } from "~/db/interface";
import { pool } from "~/db/pg";
import { TUpdatePasswordDto, TUpdateProfile } from "~/lib/validation/profile";
import bcrypt from "bcryptjs";

const getUser = async (email: string): Promise<User | null> => {
  const query = await pool.query<User>("SELECT * FROM users WHERE email = $1", [
    email
  ]);

  return query.rows[0] ? query.rows[0] : null;
};

const getUserById = async (id: number): Promise<User | null> => {
  const query = await pool.query<User>(
    "SELECT name, email, id FROM users WHERE id = $1",
    [id]
  );

  return query.rows.length > 0 ? query.rows[0] : null;
};

const updateProfile = async (userId: number, data: TUpdateProfile) => {
  return await pool.query<User>("UPDATE users SET name = $1 WHERE id = $2", [
    data.fullName,
    userId
  ]);
};

const resetPassword = async (id: number, data: TUpdatePasswordDto) => {
  const { confirmationPassword: newPassword, password: oldPassword } = data;

  const user = await pool.query<User>("SELECT * FROM users WHERE id = $1", [
    id
  ]);

  if (user.rows.length === 0) return null;

  const verify = await bcrypt.compare(oldPassword, user.rows[0].password);

  if (verify) {
    const hash = await bcrypt.hash(newPassword, 10);

    const query = await pool.query<User>(
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
      [hash, id]
    );
    return query.rows[0];
  }

  return null;
};

export { getUser, getUserById, updateProfile, resetPassword };
