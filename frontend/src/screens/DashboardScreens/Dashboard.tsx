import { useState } from "react";
import moment from "moment";
import "./styles.scss";
import toast, { Toaster } from "react-hot-toast";
import QRCode from "qrcode.react";
import { useFetchStats } from "api/fetchStats";
import { useFetchLinks } from "api/fetchLinks";
import { ViewLinkDrawer } from "./Drawers/ViewLinkDrawer";
import { CreateLinkDrawer } from "./Drawers/CreateLinkDrawer";
import { UpdateLinkDrawer } from "./Drawers/UpdateLinkDrawer";
import { BulkCreateLinkDrawer } from "./Drawers/BulkLinkDrawer";
import { LinkCardItem } from "./LinkCardItem";
import { TagFilter } from "./TagFilter";

export var isDisabled: boolean;
export var isExpired: any;

const Dashboard = () => {
  const { data: statData } = useFetchStats();
  const {
    data: linkData,
    isLoading: linkDataLoading,
    error: linkDataError,
  } = useFetchLinks();
  const [openedLink, setOpenedLink] = useState<any | null>(null);
  const [openedViewLink, setOpenedViewLink] = useState<any | null>(null);
  const [openedCreateLink, setOpenedCreateLink] = useState<boolean>(false);
  const [openedBulkCreateLink, setOpenedBulkCreateLink] =
    useState<boolean>(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagSelect = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const filteredLinks = linkData?.links?.filter(
    (link: any) =>
      selectedTags.length === 0 ||
      link.tags?.some((tag: string) => selectedTags.includes(tag))
  );

  const URLshortenerUser = window.localStorage.getItem("URLshortenerUser");
  let user_id = (URLshortenerUser && JSON.parse(URLshortenerUser).id) || {};
  let first_name =
    (URLshortenerUser && JSON.parse(URLshortenerUser).first_name) || {};

  const { total_count, total_disabled, total_enabled, total_engagements } =
    statData?.links || {};

  const getAllTags = (statData: { links: { tags: string[] }[] }): string[] => {
    return statData?.links.flatMap((link) => link.tags) || [];
  };

  const stats = [
    {
      title: "Total Links",
      value: total_count || 0,
      icon: <i className="fa-solid fa-lines-leaning"></i>,
    },
    {
      title: "Enabled Links",
      value: total_enabled || 0,
      icon: <i className="fa-solid fa-link"></i>,
    },
    {
      title: "Disabled Links",
      value: total_disabled || 0,
      icon: <i className="fa-solid fa-link-slash"></i>,
    },
    {
      title: "Link Visits",
      value: total_engagements || 0,
      icon: <i className="fa-solid fa-eye"></i>,
    },
  ];
  return (
    <div className="dashboard-page dashboard-commons">
      <section>
        <Toaster />
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex justify-content-between items-center">
                <div className="welcome-pane">
                  <h3>
                    <b>Hey {first_name || ""}, Welcome Back!</b> 👋
                  </h3>
                  <p className="">Here's your stats as of today</p>
                </div>
                <div>
                  <button
                    className="btn btn-main"
                    onClick={() => setOpenedCreateLink(true)}
                    style={{ margin: 4 }}
                  >
                    Shorten Link
                  </button>
                  <button
                    className="btn btn-main"
                    onClick={() => setOpenedBulkCreateLink(true)}
                    style={{ margin: 4 }}
                  >
                    Bulk Shorten Links
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {stats.map(({ title, value, icon }, index) => {
              return (
                <div className="col-md-3">
                  <div className="stats-card" key={index}>
                    <p className="text-sm text-white mb-4 font-semibold flex items-center gap-2">
                      {title}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="d-flex gap-2 flex-row align-items-center">
                        {icon}
                        <h3>{value}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            {linkData?.links?.length > 0 && (
              <TagFilter
                tags={getAllTags(linkData)}
                onTagSelect={handleTagSelect}
              />
            )}
          </div>

          <div className="row table-pane">
            {linkDataLoading
              ? "loading links"
              : linkDataError
              ? "An error occurred while fetching links"
              : linkData?.links?.length === 0
              ? "No links created yet"
              : filteredLinks
                  ?.sort((a: any, b: any) =>
                    moment(b.created_on).diff(moment(a.created_on))
                  )
                  .map((item: any, index: number) => (
                    <div key={index} className="col-md-12">
                      <LinkCardItem
                        setOpenedLink={setOpenedLink}
                        setOpenedViewLink={setOpenedViewLink}
                        item={item}
                      />
                    </div>
                  ))}
          </div>
        </div>
      </section>
      <ViewLinkDrawer
        openedLink={openedViewLink}
        setOpenedLink={setOpenedViewLink}
      />
      <UpdateLinkDrawer openedLink={openedLink} setOpenedLink={setOpenedLink} />
      <CreateLinkDrawer
        openedCreateLink={openedCreateLink}
        setOpenedCreateLink={setOpenedCreateLink}
      />
      <BulkCreateLinkDrawer
        openedBulkCreateLink={openedBulkCreateLink}
        setOpenedBulkCreateLink={setOpenedBulkCreateLink}
      />
    </div>
  );
};

export default Dashboard;
