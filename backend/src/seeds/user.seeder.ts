// import { Seeder } from 'typeorm-extension';
// import { DataSource } from 'typeorm';
// import { User } from '../users/user.entity';
// import * as bcrypt from 'bcrypt';

// export default class UserSeeder implements Seeder {
//   public async run(dataSource: DataSource): Promise<any> {
//     const repository = dataSource.getRepository(User);

//     const hashedPassword = await bcrypt.hash('12345678', 10);

//     await repository.insert([
//       {
//         email: 'admin@gmail.com',
//         password: hashedPassword,
//         name: 'Admin',
//         role: 'ADMIN',
//       },
//     ]);
//   }
// }
