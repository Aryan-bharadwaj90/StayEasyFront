import "./ListingCard.css";

const ListingCard = ({ listing }) => {
  return (
    <div className="card">
      <img src={listing.imageUrl} alt={listing.title} />
      <div className="card-body">
        <h3>{listing.title}</h3>
        <p>{listing.city}</p>
        <p className="price">₹ {listing.price}/night</p>
      </div>
    </div>
  );
};

export default ListingCard;
