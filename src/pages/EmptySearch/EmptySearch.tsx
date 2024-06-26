import { useParams } from 'react-router-dom';

import { PageState } from 'components';
import { faSearch } from 'icons/regular';

export const EmptySearch = () => {
  const { hash: query } = useParams() as any;

  return (
    <PageState
      icon={faSearch}
      title="Your search does not match anything we've got"
      description={
        <div className='px-spacer'>
          <span className='text-break-all'>{query}</span>
        </div>
      }
      isError
    />
  );
};
