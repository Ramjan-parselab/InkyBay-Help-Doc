import { Link } from "@remix-run/react"
import { Info } from "lucide-react"
import { useTranslation } from "react-i18next"


export default function Content({ title, badge, helpDocs, url }) {
  const {t} = useTranslation() || {};
  return (
    
    <div className="content_card">

      <div className="content_card_header">
        <div className="content_card_title">
          <div className="content_card_text">
            <p className="p1 bold2 text-[#1A1A1A]">{title}
              <span className="content_card_icon ml-2 span1 bold2 text-[#7A3314] text-center">
                {badge}
              </span>
            </p>
          </div>


          <div className="flex py-2 px-1 justify-center items-center aspect-square">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="14" viewBox="0 0 21 14" fill="none">
              <path d="M19.3334 6.99991L0.666687 6.99996M19.3334 6.99991L13.5001 12.8333M19.3334 6.99991L13.5 1.16663" stroke="#1A1A1A" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
      </div>

        {helpDocs.map((item, index) => (
          <Link key={index} to={`${url}/${item?.slug}`} className="card_category_list hover:bg-[#F8F8F8]">
            <div className="category_list_title">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M11.6667 1.89124V5.33335C11.6667 5.80006 11.6667 6.03342 11.7575 6.21168C11.8374 6.36848 11.9649 6.49596 12.1217 6.57586C12.3 6.66669 12.5333 6.66669 13 6.66669H16.4422M11.6667 14.1666H6.66671M13.3334 10.8333H6.66671M16.6667 8.32348V14.3333C16.6667 15.7334 16.6667 16.4335 16.3942 16.9683C16.1545 17.4387 15.7721 17.8211 15.3017 18.0608C14.7669 18.3333 14.0668 18.3333 12.6667 18.3333H7.33337C5.93324 18.3333 5.23318 18.3333 4.6984 18.0608C4.22799 17.8211 3.84554 17.4387 3.60586 16.9683C3.33337 16.4335 3.33337 15.7334 3.33337 14.3333V5.66663C3.33337 4.26649 3.33337 3.56643 3.60586 3.03165C3.84554 2.56124 4.22799 2.17879 4.6984 1.93911C5.23318 1.66663 5.93324 1.66663 7.33337 1.66663H10.0099C10.6213 1.66663 10.9271 1.66663 11.2148 1.7357C11.4699 1.79694 11.7137 1.89795 11.9374 2.03503C12.1897 2.18963 12.4059 2.40582 12.8383 2.8382L15.4951 5.49505C15.9275 5.92743 16.1437 6.14362 16.2983 6.39591C16.4354 6.61959 16.5364 6.86346 16.5976 7.11855C16.6667 7.40627 16.6667 7.712 16.6667 8.32348Z" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[#1a1a1a]">{item.docsLanguage?.[0]?.title}</p>
            </div>
          </Link>
        ))}

      <div className="content_card_footer">
        {helpDocs?.length > 0 ? (
            <Link to={url} className="content_card_footer_text">
                  <p className="bold2">{t("see_all_articles")}</p>
                  <div className="content_card_footer_icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="14" viewBox="0 0 21 14" fill="none">
                      <path d="M19.3334 6.99991L0.666687 6.99996M19.3334 6.99991L13.5001 12.8333M19.3334 6.99991L13.5 1.16663" stroke="#1A1A1A" strokeWidth="1.5"/>
                    </svg>
                  </div>
          </Link>
        ) : (
            <div className="content_card_footer_text">
              <p className="bold2">{t("result_not_found")} </p>
              <div className="content_card_footer_icon">
                <Info/>
              </div>
            </div>
        )}
        
      </div>


    </div>
  )
}
