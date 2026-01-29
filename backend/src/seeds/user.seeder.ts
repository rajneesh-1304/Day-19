import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Tag } from '../tags/tag.entity';

export default class TagSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tagRepository = dataSource.getRepository(Tag);

    const tags = [
      { name: 'javascript' },
      { name: 'typescript' },
      { name: 'react' },
      { name: 'nextjs' },
      { name: 'nestjs' },
      { name: 'nodejs' },
      { name: 'backend' },
      { name: 'frontend' },
      { name: 'database' },
      { name: 'postgresql' },
    ];

    for (const tag of tags) {
      const exists = await tagRepository.findOne({
        where: { name: tag.name },
      });

      if (!exists) {
        await tagRepository.save(tagRepository.create(tag));
      }
    }

    console.log('Tags seeded successfully');
  }
}
