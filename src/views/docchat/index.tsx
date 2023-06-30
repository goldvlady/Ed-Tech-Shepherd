import { PdfViewer } from "../../components";
import Chat from "./chat";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// @ts-ignore
export default function DocChat() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.documentUrl) navigate("/dashboard/notes");
  }, [navigate, location.state?.documentUrl]);

  return (
    location.state?.documentUrl && (
      <section className="divide-y max-w-screen-xl mx-auto">
        <div className="h-screen bg-white divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
          <PdfViewer
            documentUrl={location.state.documentUrl}
            docTitle={location.state.docTitle}
          />
          <Chat />
        </div>
      </section>
    )
  );
}
