import React from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";

function Gig() {
  const { id } = useParams();

  // Fetch gig data
  const { isLoading, error, data } = useQuery({
    queryKey: ["gig", id],
    queryFn: () =>
      newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;

  // Fetch user data only if userId is available
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId, // Only fetch when userId is available
  });

  return (
    <div className="gig">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          {/* LEFT SECTION */}
          <div className="left">
            <span className="breadcrumbs">
              Fiverr {">"} Graphics & Design {">"}
            </span>
            <h1>{data?.title || "Untitled"}</h1>

            {/* USER SECTION */}
            {isLoadingUser ? (
              "Loading..."
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="user">
                <img
                  className="pp"
                  src={dataUser?.img || "/img/noavatar.jpg"}
                  alt="User Avatar"
                />
                <span>{dataUser?.username || "Unknown"}</span>
                {!isNaN(data?.totalStars / data?.starNumber) && (
                  <div className="stars">
                    {Array(Math.round(data?.totalStars / data?.starNumber))
                      .fill()
                      .map((_, i) => (
                        <img src="/img/star.png" alt="" key={i} />
                      ))}
                    <span>
                      {Math.round(data?.totalStars / data?.starNumber) || 0}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* SLIDER (Use optional chaining and default value) */}
            {data?.images?.length > 0 ? (
              <Slider slidesToShow={1} arrowsScroll={1} className="slider">
                {data?.images?.map((img) => (
                  <img key={img} src={img} alt="Gig" />
                ))}
              </Slider>
            ) : (
              <p>No images available</p>
            )}

            {/* DESCRIPTION */}
            <h2>About This Gig</h2>
            <p>{data?.desc || "No description available"}</p>

            {/* SELLER SECTION */}
            {dataUser && (
              <div className="seller">
                <h2>About The Seller</h2>
                <div className="user">
                  <img src={dataUser?.img || "/img/noavatar.jpg"} alt="" />
                  <div className="info">
                    <span>{dataUser?.username || "Unknown"}</span>
                    {!isNaN(data?.totalStars / data?.starNumber) && (
                      <div className="stars">
                        {Array(
                          Math.round(data?.totalStars / data?.starNumber)
                        )
                          .fill()
                          .map((_, i) => (
                            <img src="/img/star.png" alt="" key={i} />
                          ))}
                        <span>
                          {Math.round(data?.totalStars / data?.starNumber) || 0}
                        </span>
                      </div>
                    )}
                    <button>Contact Me</button>
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">
                        {dataUser?.country || "Not available"}
                      </span>
                    </div>
                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">
                        {dataUser?.languages?.join(", ") || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <hr />
                  <p>{dataUser?.desc || "No details provided"}</p>
                </div>
              </div>
            )}

            {/* REVIEWS */}
            <Reviews gigId={id} />
          </div>

          {/* RIGHT SECTION */}
          <div className="right">
            <div className="price">
              <h3>{data?.shortTitle || "No title"}</h3>
              <h2>${data?.price || 0}</h2>
            </div>
            <p>{data?.shortDesc || "No description"}</p>
            <div className="details">
              <div className="item">
                <img src="/img/clock.png" alt="" />
                <span>
                  {data?.deliveryDate
                    ? `${data.deliveryDate} Days Delivery`
                    : "N/A"}
                </span>
              </div>
              <div className="item">
                <img src="/img/recycle.png" alt="" />
                <span>
                  {data?.revisionNumber
                    ? `${data.revisionNumber} Revisions`
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* FEATURES */}
            {data?.features?.length > 0 ? (
              <div className="features">
                {data?.features?.map((feature) => (
                  <div className="item" key={feature}>
                    <img src="/img/greencheck.png" alt="" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No features available</p>
            )}

            <Link to={`/pay/${id}`}>
              <button>Continue</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
