import { PageState } from 'components';
import { faPalette } from 'icons/regular';

export const FailedNfts = () => {
  return <PageState icon={faPalette} title='Unable to load NFTs' isError />;
};
