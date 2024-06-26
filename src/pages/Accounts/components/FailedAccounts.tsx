import { PageState } from 'components';
import { faUser } from 'icons/regular';

export const FailedAccounts = () => {
  return <PageState icon={faUser} title='Unable to load accounts' isError />;
};
