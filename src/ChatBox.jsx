import React, { useState, useEffect } from 'react';

// Mock tour data với format như bạn cung cấp
import toursData from '../tourData.json';

const quickReplies = [
  { label: '🔍 Tìm Tour nhanh', action: 'find_tour', icon: '🔍' },
  { label: '📋 Tìm hiểu visa', action: 'visa_info', icon: '📋' },
  { label: '🗺️ Travel-guide', action: 'travel_guide', icon: '🗺️' },
  { label: '⭐ Tour nổi bật', action: 'featured_tour', icon: '⭐' },
  { label: '❓ FAQs', action: 'faqs', icon: '❓' },
];

const featuredTour = toursData.tours[0];

const visaOptions = [
  { label: 'Vietnam E-visa', url: 'https://hopon-hopoff.vn/vietnam-e-visa' },
  { label: 'Visa Nhật', url: 'https://hopon-hopoff.vn/visa-nhat' },
  { label: 'Visa du lịch Pháp', url: 'https://hopon-hopoff.vn/visa-du-lich-phap' },
];

const faqsUrl = 'https://hopon-hopoff.vn/faqs';
const travelGuideUrl = 'https://hopon-hopoff.vn/category/travel-guide';

const getTourTypes = (tours) => {
  const types = new Set();
  tours.forEach(t => {
    if (t.tour_type) types.add(t.tour_type);
  });
  return Array.from(types);
};

const defaultTourImg = 'https://cdn.hopon-hopoff.vn/tour-default.jpg'; // ảnh mặc định

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Chào mừng bạn đến với Hop On Hop Off! 🎯 Chúng tôi có thể giúp gì cho bạn hôm nay?', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [showTourList, setShowTourList] = useState(false);
  const [tourFilter, setTourFilter] = useState({ title: '', price: '', location: '', type: '' });
  const [filteredTours, setFilteredTours] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showChatBox, setShowChatBox] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredTitleId, setHoveredTitleId] = useState(null);
  const tourTypes = getTourTypes(toursData.tours);

  const getMinMaxPrice = () => {
    let min = Infinity, max = 0;
    toursData.tours.forEach(t => {
      if (t.price) {
        const match = t.price.match(/\$(\d+(?:\.\d+)?)/);
        if (match) {
          const priceNum = parseFloat(match[1]);
          if (priceNum < min) min = priceNum;
          if (priceNum > max) max = priceNum;
        }
      }
    });
    return { min, max };
  };
  const { min: minPrice, max: maxPrice } = getMinMaxPrice();

  useEffect(() => {
    if (showTourList) {
      setIsLoading(true);
      setTimeout(() => {
        let result = toursData.tours;

        if (tourFilter.title) {
          const keyword = tourFilter.title.toLowerCase();
          result = result.filter(t =>
            (t.title && t.title.toLowerCase().includes(keyword)) ||
            (t.title_vn && t.title_vn.toLowerCase().includes(keyword))
          );
        }

        if (tourFilter.price) {
          result = result.filter(t => {
            if (!t.price) return false;
            const match = t.price.match(/\$(\d+(?:\.\d+)?)/);
            if (!match) return false;
            const priceNum = parseFloat(match[1]);
            return priceNum <= Number(tourFilter.price);
          });
        }

        if (tourFilter.location) {
          result = result.filter(t => {
            const loc = tourFilter.location.toLowerCase();
            return (t.city && t.city.toLowerCase().includes(loc)) ||
              (t.region && t.region.toLowerCase().includes(loc)) ||
              (t.title && t.title.toLowerCase().includes(loc));
          });
        }

        if (tourFilter.type) {
          result = result.filter(t => t.tour_type === tourFilter.type);
        }

        setFilteredTours(result);
        setVisibleCount(5); // reset mỗi lần lọc
        setIsLoading(false);
      }, 350); // mô phỏng loading
    }
  }, [tourFilter, showTourList]);

  const addBotMessage = (content, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'bot', text: content, timestamp: new Date() }]);
      setIsTyping(false);
    }, delay);
  };

  const handleQuickReply = (action) => {
    if (action === 'find_tour') {
      setMessages(msgs => [...msgs, { from: 'user', text: 'Tìm Tour nhanh', timestamp: new Date() }]);
      setShowTourList(true);
      setTourFilter({ title: '', price: '', location: '', type: '' });
      setFilteredTours([]);
      addBotMessage('Tuyệt vời! Hãy sử dụng bộ lọc bên dưới để tìm tour phù hợp với bạn 🔍', 500);
    } else if (action === 'visa_info') {
      setMessages(msgs => [
        ...msgs,
        { from: 'user', text: 'Tìm hiểu visa', timestamp: new Date() }
      ]);
      addBotMessage(
        <div>
          <div style={{ marginBottom: 8 }}>📋 Chọn loại visa bạn muốn tìm hiểu:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {visaOptions.map(v => (
              <a
                key={v.label}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, rgb(255 0 0) 0%, rgb(233 3 3) 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  textAlign: 'center',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={e => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={e => e.target.style.transform = 'scale(1)'}
              >
                {v.label}
              </a>
            ))}
          </div>
        </div>
      );
      setShowTourList(false);
    } else if (action === 'travel_guide') {
      setMessages(msgs => [
        ...msgs,
        { from: 'user', text: 'Travel-guide', timestamp: new Date() }
      ]);
      addBotMessage(
        <a
          href={travelGuideUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            display: 'inline-block'
          }}
        >
          🗺️ Xem hướng dẫn du lịch chi tiết
        </a>
      );
      setShowTourList(false);
    } else if (action === 'faqs') {
      setMessages(msgs => [
        ...msgs,
        { from: 'user', text: 'FAQs', timestamp: new Date() }
      ]);
      addBotMessage(
        <a
          href={faqsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            display: 'inline-block'
          }}
        >
          ❓ Xem các câu hỏi thường gặp
        </a>
      );
      setShowTourList(false);
    } else if (action === 'featured_tour') {
      setMessages(msgs => [...msgs, { from: 'user', text: 'Thông tin tour nổi bật', timestamp: new Date() }]);
      setShowTourList(false);
      addBotMessage(
        <div style={{
          background: 'linear-gradient(135deg, rgb(255 0 0) 0%, rgb(233 3 3) 100%)',
          color: 'white',
          padding: 16,
          borderRadius: 12,
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            ⭐ {featuredTour.title_vn}
          </div>
          <div style={{ fontSize: 13, marginBottom: 8, opacity: 0.9 }}>{featuredTour.description}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>💰 {featuredTour.price}</div>
              {featuredTour.duration && <div style={{ fontSize: 12, opacity: 0.8 }}>⏱ {featuredTour.duration}</div>}
            </div>
            <a
              href={featuredTour.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              Đặt ngay →
            </a>
          </div>
        </div>
      );
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input, timestamp: new Date() }]);

    // Simple auto-response
    const lowerInput = input.toLowerCase();
    let response = "Cảm ơn bạn đã liên hệ! Tôi sẽ chuyển cho nhân viên tư vấn để hỗ trợ bạn tốt nhất. 😊";

    if (lowerInput.includes('giá') || lowerInput.includes('price')) {
      response = "Bạn có thể xem giá các tour trong danh sách hoặc nhấn 'Tìm Tour nhanh' để lọc theo ngân sách của mình! 💰";
    } else if (lowerInput.includes('visa')) {
      response = "Nhấn vào 'Tìm hiểu visa' để xem thông tin chi tiết về các loại visa nhé! 📋";
    }

    addBotMessage(response);
    setInput('');
  };

  useEffect(() => {
    if (showChatBox) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [showChatBox]);

  if (!showChatBox) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 999
        }}
      >
        {/* Bubble text bên cạnh */}
        <div
          style={{
            background: '#f9fafb',
            color: '#374151',
            padding: '10px 14px',
            borderRadius: 20,
            boxShadow: 'rgba(0, 0, 0, 0.1) -1px 2px 6px 6px',
            fontSize: 14,
            maxWidth: 200,
            whiteSpace: 'nowrap',
            paddingRight: 30,
          }}
        >
          Bạn cần hỗ trợ? Chat với chúng tôi!
        </div>

        {/* Nút chat tròn */}
        <div
          onClick={() => setShowChatBox(true)}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgb(255 0 0) 0%, rgb(233 3 3) 100%)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            fontSize: '28px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            animation: 'pulse 2s infinite'
          }}
          onMouseOver={e => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
          }}
          onMouseOut={e => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
          }}
          aria-label="Mở chatbox"
          title="Cần hỗ trợ? Chat với chúng tôi!"
        >
          💬
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse {
              0% { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); }
              50% { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.8); }
              100% { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); }
            }
          `
        }} />
      </div>
    );
  }
  

  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000, maxWidth: 440, width: '90vw', maxHeight: '80vh' }}>
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgb(255 0 0) 0%, rgb(233 3 3) 100%)',
          color: 'white',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18
            }}>
              🎯
            </div>
            <div style={{textAlign: 'left'}}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>Hop On Hop Off</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Tư vấn viên du lịch</div>
            </div>
          </div>
          <button
            onClick={() => setShowChatBox(false)}
            style={{
              background: 'rgba(255,255,255,0)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              color: 'white',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Đóng chatbox"
          >
            ×
          </button>
        </div>

        {/* Chat Window */}
        <div style={{
          background: '#f8fafc',
          minHeight: 200,
          maxHeight: 320,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 8
            }}>
              {msg.from === 'bot' && (
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgb(255 0 0) 0%, rgb(233 3 3) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  color: 'white',
                  flexShrink: 0
                }}>
                  🤖
                </div>
              )}
              <div style={{
                background: msg.from === 'user'
                  ? 'linear-gradient(135deg, rgb(255 0 0) 0%, rgb(233 3 3) 100%)'
                  : 'white',
                color: msg.from === 'user' ? 'white' : '#374151',
                padding: '12px 16px',
                borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                maxWidth: '75%',
                fontSize: 14,
                lineHeight: 1.4,
                boxShadow: msg.from === 'user'
                  ? '0 2px 8px rgba(102, 126, 234, 0.3)'
                  : '0 2px 8px rgba(0,0,0,0.1)',
                textAlign:'left'
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgb(255 0 0) 0%, rgb(233 3 3) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: 'white'
              }}>
                🤖
              </div>
              <div style={{
                background: 'white',
                padding: '12px 16px',
                borderRadius: '16px 16px 16px 4px',
                fontSize: 14,
                color: '#9ca3af'
              }}>
                Đang nhập...
              </div>
            </div>
          )}

          {/* Tour Filter */}
          {showTourList && (
            <div style={{
              background: 'white',
              borderRadius: 12,
              padding: 16,
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontWeight: 600, marginBottom: 12, color: '#374151' }}>🔍 Lọc tour theo:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  type="text"
                  placeholder="Tìm theo tên tour..."
                  value={tourFilter.title}
                  onChange={e => setTourFilter(f => ({ ...f, title: e.target.value }))}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
                <select
                  value={tourFilter.type}
                  onChange={e => setTourFilter(f => ({ ...f, type: e.target.value }))}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                    outline: 'none'
                  }}
                >
                  <option value="">Tất cả loại tour</option>
                  {tourTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={tourFilter.price || maxPrice}
                    onChange={e => setTourFilter(f => ({ ...f, price: e.target.value }))}
                    style={{ flex: 1 }}
                  />
                  <span style={{ minWidth: 80, fontSize: 13, color: '#6b7280' }}>
                    Max: ${tourFilter.price || maxPrice}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Địa điểm (VD: Ho Chi Minh, Europe...)"
                  value={tourFilter.location}
                  onChange={e => setTourFilter(f => ({ ...f, location: e.target.value }))}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: 14,
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 500, marginBottom: 4, color: '#374151' }}>
                  Kết quả:
                </div>
                {isLoading ? (
                  <div style={{ textAlign: 'center', color: '#007bff', padding: 24 }}>
                    <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>⏳</span>
                    Đang tải kết quả...
                  </div>
                ) : filteredTours.length === 0 ? (
                  <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: 24 }}>
                    <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>😕</span>
                    Không tìm thấy tour phù hợp.<br />
                    <span style={{ fontSize: 13, color: '#aaa' }}>Thử từ khóa khác hoặc chọn lại bộ lọc.</span>
                  </div>
                ) : (
                  <>
                    {filteredTours.slice(0, visibleCount).map(tour => {
                      const isTitleLong = tour.title && tour.title.length > 40;
                      return (
                        <div
                          key={tour.id}
                          onClick={() => tour.url && window.open(tour.url, '_blank')}
                          onMouseOver={e => {
                            e.currentTarget.style.boxShadow = '0 4px 16px #e0e3ef';
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.boxShadow = '0 2px 8px #f0f1f6';
                            e.currentTarget.style.transform = 'none';
                          }}
                          style={{
                            background: '#fff',
                            border: '1px solid #e3e6ef',
                            borderRadius: 12,
                            boxShadow: '0 2px 8px #f0f1f6',
                            padding: 14,
                            marginBottom: 14,
                            transition: 'box-shadow 0.2s, transform 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                            cursor: tour.url ? 'pointer' : 'default',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, position: 'relative' }}>
                            <span style={{ fontSize: 20, color: '#007bff' }} title="Tour bus">🚌</span>
                            <span
                              style={{
                                fontWeight: 700,
                                fontSize: 16,
                                color: '#222',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 240,
                                cursor: isTitleLong ? 'pointer' : 'inherit',
                                // borderBottom: isTitleLong ? '1px dashed #aaa' : 'none',
                                position: 'relative',
                              }}
                              onMouseEnter={isTitleLong ? () => setHoveredTitleId(tour.id) : undefined}
                              onMouseLeave={isTitleLong ? () => setHoveredTitleId(null) : undefined}
                            >
                              {tour.title}
                              {isTitleLong && hoveredTitleId === tour.id && (
                                <div style={{
                                  position: 'absolute',
                                  top: 28,
                                  left: 0,
                                  background: '#222',
                                  color: '#fff',
                                  padding: '6px 12px',
                                  borderRadius: 6,
                                  fontSize: 13,
                                  whiteSpace: 'pre-line',
                                  zIndex: 20,
                                  boxShadow: '0 2px 8px #bbb',
                                  maxWidth: 320,
                                  pointerEvents: 'none',
                                }}>
                                  {tour.title}
                                </div>
                              )}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, color: '#555', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{tour.description}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                            <span style={{ fontSize: 15, color: '#007bff', fontWeight: 600 }}>Giá: {tour.price}</span>
                            {tour.url && (
                              <a
                                href={tour.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#fff',
                                  background: '#007bff',
                                  padding: '6px 16px',
                                  borderRadius: 8,
                                  fontSize: 13,
                                  textDecoration: 'none',
                                  fontWeight: 500,
                                  boxShadow: '0 1px 4px #e0e3ef',
                                  marginLeft: 8
                                }}
                                onClick={e => e.stopPropagation()}
                              >
                                Xem chi tiết
                              </a>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: 12, marginTop: 2, flexWrap: 'wrap' }}>
                            {tour.duration && <span style={{ fontSize: 12, color: '#888' }} title="Thời lượng"><span role="img" aria-label="duration">⏱</span> {tour.duration}</span>}
                            {tour.city && <span style={{ fontSize: 12, color: '#888' }} title="Thành phố"><span role="img" aria-label="city">📍</span> {tour.city}</span>}
                            {tour.tour_type && <span style={{ fontSize: 12, color: '#888' }} title="Loại tour"><span role="img" aria-label="type">🏷</span> {tour.tour_type}</span>}
                          </div>
                        </div>
                      );
                    })}
                    {filteredTours.length > visibleCount && (
                      <button
                        onClick={() => setVisibleCount(count => count + 5)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #007bff',
                          borderRadius: 6,
                          background: '#fff',
                          color: '#007bff',
                          fontSize: 13,
                          cursor: 'pointer',
                          margin: '0 auto',
                          display: 'block',
                          marginTop: 8
                        }}
                      >
                        Hiển thị thêm
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Replies */}
        <div style={{
          padding: '16px 20px 12px',
          background: 'white',
          borderTop: '1px solid #f3f4f6'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 12
          }}>
            {quickReplies.map(q => (
              <button
                key={q.action}
                style={{
                  padding: '8px 12px',
                  borderRadius: 20,
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: '#374151',
                  transition: 'all 0.2s ease',
                  fontWeight: 500
                }}
                onClick={() => handleQuickReply(q.action)}
                onMouseOver={e => {
                  e.target.style.background = '#667eea';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = '#667eea';
                }}
                onMouseOut={e => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.color = '#374151';
                  e.target.style.borderColor = '#e5e7eb';
                }}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi của bạn..."
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 25,
                border: '1px solid #d1d5db',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#667eea'}
              onBlur={e => e.target.style.borderColor = '#d1d5db'}
            />
            <button
              onClick={handleSend}
              style={{
                padding: '12px 20px',
                borderRadius: 25,
                background: 'linear-gradient(135deg, rgb(255 0 0) 0%, rgb(233 3 3) 100%)',
                color: 'white',
                border: 'none',
                fontWeight: 500,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                minWidth: 60
              }}
              onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.target.style.transform = 'scale(1)'}
            >
              📤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox