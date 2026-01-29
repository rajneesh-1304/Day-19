import dataSource from 'src/data-source';
import { runSeeders } from 'typeorm-extension';
(async () => {
  await dataSource.initialize();
  await runSeeders(dataSource);
})();
