import React from 'react';

const tour = {
  name: 'HoChiMinh City Hop On – Hop Off Bus (Valid 24 hours)',
  description: '(Tiếng Việt) Tham gia vào chuyến phiêu lưu vòng quanh thành phố với dịch vụ xe buýt đỏ mui trần duy nhất của Hồ Chí Minh trong 24h kể từ khi lên xe. Xe buýt',
  price: 22,
  unit: 'per person',
  link: '#',
};

const categories = [
  {
    name: 'Hop on hop off bus',
    items: ['Ho Chi Minh City', 'Ha Noi Capital'],
  },
  {
    name: 'VietNam Tour',
    items: ['COMBO TOUR', 'MEKONG DELTA', 'CU CHI TUNNEL', 'CAR RENTAL'],
  },
  {
    name: 'INTERNATIONAL TOURS',
    items: ['VISA', 'ASIA', 'EUROPE', 'AUSTRALIA', 'AMERICA', 'EUROPE TRAIN', 'TRAVEL EUROPE BY RAIL'],
  },
  {
    name: 'VISA',
    items: ['VIETNAM E-VISA', 'JAPAN VISA', 'VISA FRANCE', 'APPLY FOR VIETNAM EVISA', 'E-VISA IMMIGRATION TO VIETNAM'],
  },
  {
    name: 'HELP',
    items: ['TRAVEL GUIDE', 'TOUR MAP', 'BOOKING & PAYMENT', 'FOR AGENCY', 'FAQS'],
  },
  {
    name: 'ABOUT US',
    items: ['ANH VIET TOURIST', '10 INTERESTED THINGS'],
  },
];

const TourInfo = () => (
  <div style={{ maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' }}>
    <h2>{tour.name}</h2>
    <p>{tour.description}</p>
    <div style={{ fontWeight: 'bold', margin: '8px 0' }}>From ${tour.price}</div>
    <div style={{ color: '#888', marginBottom: 8 }}>{tour.unit}</div>
    <a href={tour.link} style={{ color: '#fff', background: '#007bff', padding: '8px 16px', borderRadius: 4, textDecoration: 'none' }}>View tour</a>
    <hr style={{ margin: '24px 0' }} />
    <h3>Categories</h3>
    <ul>
      {categories.map((cat) => (
        <li key={cat.name} style={{ marginBottom: 8 }}>
          <strong>{cat.name}</strong>
          <ul style={{ marginLeft: 16 }}>
            {cat.items.map((item) => (
              <li key={item}>+ {item}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </div>
);

export default TourInfo;
