import { useEffect, useState } from 'react';
import BreadCrumb from './_components/breadcrumb';
import ThumbnailList from './_components/thumbnail-list';
import ApiService from '../../../../../services/ApiService';

const DocsThumbnailList = ({ conversationID }: { conversationID: string }) => {
  const [fetchedDocuments, setFetchedDocuments] = useState<any[]>([]);

  useEffect(() => {
    ApiService.fetchMultiDocBasedOnConversationID(conversationID)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setFetchedDocuments(data.data);
        }
      });
  }, []);

  return (
    <div className="w-[16.97rem] h-full pt-[0.62rem] px-[1.8rem] pr-[4.5rem]">
      <BreadCrumb />
      <ThumbnailList fetchedDocuments={fetchedDocuments} />
    </div>
  );
};

export default DocsThumbnailList;
