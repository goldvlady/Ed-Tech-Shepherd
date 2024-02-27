import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent
} from '../../../../../../../../components/ui/dialog';
import OcclusionWorkSpace from '../form/_components/occlusion/_components/occlusion-workspace';
import { Button } from '../../../../../../../../components/ui/button';
import { DotsHorizontal } from '../../../../../../../../components/icons';

function StudySession({ open, data }: { open: boolean; data: any }) {
  const [studySession, setStudySession] = useState(data);

  console.log(studySession);
  useEffect(() => {
    if (open) {
      setStudySession(data);
    } else {
      setStudySession({});
    }
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent className="bg-white p-0 w-[740px] max-w-4xl">
        <header className="p-4 border-b flex items-center justify-between">
          <div className="left flex items-center gap-2">
            <h4 className="text-[#212224] text-lg">Study Session</h4>
            <p className="bg-[#F4F5F6] text-[#585F68] text-xs p-1.5 rounded">
              {studySession?.title}
            </p>
          </div>
          <div className="right flex items-center gap-3">
            <div>
              <Button>
                <span className="inline-block mr-2">
                  <svg
                    width="14"
                    height="20"
                    viewBox="0 0 14 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.8335 8.33334H13.6668L6.16683 19.1667V11.6667H0.333496L7.8335 0.833344V8.33334Z"
                      fill="white"
                    />
                  </svg>
                </span>

                <span>Start</span>
              </Button>
            </div>
            <div>
              <DotsHorizontal />
            </div>
          </div>
        </header>
        <div className="body">
          <OcclusionWorkSpace
            imageURI={studySession.imageUrl}
            items={studySession.labels}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default StudySession;
