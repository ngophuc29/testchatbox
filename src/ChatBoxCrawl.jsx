import React, { useState, useEffect } from 'react';
import toursDataRaw from '../tours_crawled.json';

const quickRepliesVN = [
    { label: '🔍 Tìm Tour nhanh', action: 'find_tour', icon: '🔍' },
    { label: '📋 Tìm hiểu visa', action: 'visa_info', icon: '📋' },
    { label: '🗺️ Travel-guide', action: 'travel_guide', icon: '🗺️' },
    { label: '⭐ Tour nổi bật', action: 'featured_tour', icon: '⭐' },
    { label: '❓ FAQs', action: 'faqs', icon: '❓' },
];
const quickRepliesEN = [
    { label: '🔍 Quick Tour Search', action: 'find_tour', icon: '🔍' },
    { label: '📋 Visa Info', action: 'visa_info', icon: '📋' },
    { label: '🗺️ Travel-guide', action: 'travel_guide', icon: '🗺️' },
    { label: '⭐ Featured Tour', action: 'featured_tour', icon: '⭐' },
    { label: '❓ FAQs', action: 'faqs', icon: '❓' },
];

const visaOptionsVN = [
    { label: 'Vietnam E-visa', url: 'https://hopon-hopoff.vn/vietnam-e-visa' },
    { label: 'Visa Nhật', url: 'https://hopon-hopoff.vn/visa-nhat' },
    { label: 'Visa du lịch Pháp', url: 'https://hopon-hopoff.vn/visa-du-lich-phap' },
];
const visaOptionsEN = [
    { label: 'Vietnam E-visa', url: 'https://hopon-hopoff.vn/vietnam-e-visa' },
    { label: 'Japan Visa', url: 'https://hopon-hopoff.vn/visa-nhat' },
    { label: 'France Tourist Visa', url: 'https://hopon-hopoff.vn/visa-du-lich-phap' },
];

const faqsUrlVN = 'https://hopon-hopoff.vn/faqs';
const faqsUrlEN = 'https://hopon-hopoff.vn/faqs';
const travelGuideUrlVN = 'https://hopon-hopoff.vn/category/travel-guide';
const travelGuideUrlEN = 'https://hopon-hopoff.vn/category/travel-guide';

const getTourTypes = (tours) => {
    const types = new Set();
    tours.forEach(t => {
        if (t.tour_type && t.tour_type.trim()) types.add(t.tour_type.trim());
    });
    return Array.from(types);
};

const toursVN = toursDataRaw.tours_vn;
const toursEN = toursDataRaw.tours_en;

const TEXT = {
    VN: {
        welcome: 'Chào mừng bạn đến với Hop On Hop Off! 🎯 Chúng tôi có thể giúp gì cho bạn hôm nay?',
        chatPlaceholder: 'Nhập câu hỏi của bạn...',
        filterTitle: '🔍 Lọc tour theo:',
        filterName: 'Tìm theo tên tour...',
        filterType: 'Tất cả loại tour',
        filterLocation: 'Địa điểm (VD: Ho Chi Minh, Europe...)',
        filterResult: 'Kết quả:',
        filterNoResult: 'Không tìm thấy tour phù hợp.\nThử từ khóa khác hoặc chọn lại bộ lọc.',
        filterLoading: 'Đang tải kết quả...',
        filterShowMore: 'Hiển thị thêm',
        seeDetail: 'Xem chi tiết',
        max: 'Max',
        price: 'Giá',
        duration: 'Thời lượng',
        botThanks: 'Cảm ơn bạn đã liên hệ! Tôi sẽ chuyển cho nhân viên tư vấn để hỗ trợ bạn tốt nhất. 😊',
        botAskPrice: 'Bạn muốn hỏi về giá tour nào? Vui lòng nhập tên tour hoặc dùng bộ lọc.',
        botAskFilter: 'Bạn hãy nhập từ khóa hoặc chọn bộ lọc để tìm tour phù hợp nhé!',
        botVisa: 'Thông tin visa bạn cần:',
        botTravelGuide: 'Xem các bài viết hướng dẫn du lịch tại đây',
        botFaq: 'Xem các câu hỏi thường gặp',
        chatWithUs: 'Bạn cần hỗ trợ? Chat với chúng tôi!'
    },
    EN: {
        welcome: 'Welcome to Hop On Hop Off! 🎯 How can we help you today?',
        chatPlaceholder: 'Type your question...',
        filterTitle: '🔍 Filter tours by:',
        filterName: 'Search by tour name...',
        filterType: 'All tour types',
        filterLocation: 'Location (e.g. Ho Chi Minh, Europe...)',
        filterResult: 'Results:',
        filterNoResult: 'No matching tours found.\nTry another keyword or adjust your filter.',
        filterLoading: 'Loading results...',
        filterShowMore: 'Show more',
        seeDetail: 'See detail',
        max: 'Max',
        price: 'Price',
        duration: 'Duration',
        botThanks: 'Thank you for contacting us! I will forward your request to our consultant for the best support. 😊',
        botAskPrice: 'Which tour price do you want to ask? Please enter the tour name or use the filter.',
        botAskFilter: 'Please enter a keyword or use the filter to find a suitable tour!',
        botVisa: 'Visa information you need:',
        botTravelGuide: 'See travel guide articles here',
        botFaq: 'See frequently asked questions',
        chatWithUs: 'Need help? Chat with us!'
    }
};

const ChatBoxCrawl = () => {
    const [lang, setLang] = useState('VN');
    const [messages, setMessages] = useState([
        { from: 'bot', text: TEXT['VN'].welcome, timestamp: new Date() },
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
    const [isFeatured, setIsFeatured] = useState(false);
    const tours = lang === 'VN' ? toursVN : toursEN;
    const tourTypes = getTourTypes(tours);
    const quickReplies = lang === 'VN' ? quickRepliesVN : quickRepliesEN;
    const visaOptions = lang === 'VN' ? visaOptionsVN : visaOptionsEN;
    const faqsUrl = lang === 'VN' ? faqsUrlVN : faqsUrlEN;
    const travelGuideUrl = lang === 'VN' ? travelGuideUrlVN : travelGuideUrlEN;
    const text = TEXT[lang];

    const chatWindowRef = React.useRef(null);

    useEffect(() => {
        if (chatWindowRef.current && !showTourList && !isFeatured) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages, isTyping, showTourList, isFeatured]);

    useEffect(() => {
        setMessages([{ from: 'bot', text: text.welcome, timestamp: new Date() }]);
        setShowTourList(false);
        setTourFilter({ title: '', price: '', location: '', type: '' });
    }, [lang]);

    const getMinMaxPrice = () => {
        let min = Infinity, max = 0;
        tours.forEach(t => {
            let price = 0;
            if (typeof t.price === 'string') {
                const p = t.price.replace(/[^\d]/g, '');
                price = parseInt(p, 10) || 0;
            } else if (typeof t.price === 'number') {
                price = t.price;
            }
            if (price > 0) {
                min = Math.min(min, price);
                max = Math.max(max, price);
            }
        });
        if (min === Infinity) min = 0;
        return { min, max };
    };
    const { min: minPrice, max: maxPrice } = getMinMaxPrice();

    useEffect(() => {
        if (showTourList) {
            setIsLoading(true);
            setTimeout(() => {
                let result = tours.filter(t => {
                    let match = true;
                    if (tourFilter.title && !t.title.toLowerCase().includes(tourFilter.title.toLowerCase())) match = false;
                    if (tourFilter.type && t.tour_type !== tourFilter.type) match = false;
                    if (tourFilter.location && !t.description.toLowerCase().includes(tourFilter.location.toLowerCase()) && !t.title.toLowerCase().includes(tourFilter.location.toLowerCase())) match = false;
                    if (tourFilter.price) {
                        const p = t.price.replace(/[^\d]/g, '');
                        if (p && parseInt(p, 10) > parseInt(tourFilter.price, 10)) match = false;
                    }
                    return match;
                });
                setFilteredTours(result);
                setVisibleCount(3);
                setIsLoading(false);
            }, 400);
        }
    }, [tourFilter, showTourList, lang]);

    const addBotMessage = (content, delay = 800) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(msgs => [...msgs, { from: 'bot', text: content, timestamp: new Date() }]);
            setIsTyping(false);
        }, delay);
    };

    const handleQuickReply = (action) => {
        const replyObj = quickReplies.find(q => q.action === action);
        if (replyObj) {
            setMessages(msgs => [...msgs, { from: 'user', text: replyObj.label, timestamp: new Date() }]);
        }
        if (action === 'find_tour') {
            setShowTourList(true);
            setIsFeatured(false);
            setTourFilter({ title: '', price: '', location: '', type: '' });
            addBotMessage(text.botAskFilter);
        } else if (action === 'featured_tour') {
            setShowTourList(false);
            setIsFeatured(true);
            // Lấy các tour nổi bật (NEW hoặc Special Tour)
            const featuredTours = tours.filter(t => t.tour_type && (t.tour_type.toLowerCase().includes('new') || t.tour_type.toLowerCase().includes('special')));
            if (featuredTours.length === 0) {
                addBotMessage(text.filterNoResult);
            } else {
                addBotMessage(
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>{lang === 'VN' ? 'Tour nổi bật:' : 'Featured tours:'}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {featuredTours.slice(0, 5).map((tour, idx) => {
                                const isTitleLong = tour.title && tour.title.length > 40;
                                return (
                                    <div
                                        key={tour.url}
                                        style={{
                                            border: '1px solid #e5e7eb',
                                            borderRadius: 10,
                                            padding: 14,
                                            background: '#fff',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                            transition: 'box-shadow 0.2s',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            minHeight: 60,
                                            marginBottom: 4
                                        }}
                                        onClick={() => window.open(tour.url, '_blank')}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ fontWeight: 600, fontSize: 15, color: '#d90429', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260, position: 'relative' }}
                                                title={isTitleLong ? tour.title : undefined}
                                            >
                                                {tour.title && tour.title.length > 40 ? (
                                                    <span
                                                        style={{ borderBottom: '1px dotted #888', cursor: 'help' }}
                                                        title={tour.title}
                                                    >
                                                        {tour.title.slice(0, 40) + '...'}
                                                    </span>
                                                ) : tour.title}
                                            </div>
                                            {tour.tour_type && <span style={{ fontSize: 12, color: '#fff', background: '#d90429', borderRadius: 6, padding: '2px 8px', marginLeft: 6 }}>{tour.tour_type}</span>}
                                        </div>
                                        <div style={{ fontSize: 13, color: '#374151', margin: '6px 0 2px 0', minHeight: 18 }}>
                                            {tour.description && tour.description.length > 80 ? tour.description.slice(0, 80) + '...' : tour.description}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
                                            {tour.duration && <span title={text.duration} style={{ fontSize: 12, color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}><span role="img" aria-label="clock">⏱️</span> {tour.duration}</span>}
                                            {tour.price && <span title={text.price} style={{ fontSize: 13, color: '#007bff', fontWeight: 600, marginLeft: 8 }}>{tour.price}</span>}
                                            <a
                                                href={tour.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    marginLeft: 'auto',
                                                    fontSize: 13,
                                                    color: '#fff',
                                                    background: '#007bff',
                                                    borderRadius: 6,
                                                    padding: '4px 10px',
                                                    textDecoration: 'none',
                                                    fontWeight: 500
                                                }}
                                                onClick={e => e.stopPropagation()}
                                            >
                                                {text.seeDetail}
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }
        } else {
            setShowTourList(false);
            setIsFeatured(false);
        }
        if (action === 'visa_info') {
            addBotMessage(<div>
                <div>{text.botVisa}</div>
                <ul style={{margin:0,paddingLeft:18}}>
                    {visaOptions.map(v => <li key={v.url}><a href={v.url} target="_blank" rel="noopener noreferrer">{v.label}</a></li>)}
                </ul>
            </div>);
        } else if (action === 'travel_guide') {
            addBotMessage(<a href={travelGuideUrl} target="_blank" rel="noopener noreferrer">{text.botTravelGuide}</a>);
        } else if (action === 'faqs') {
            addBotMessage(<a href={faqsUrl} target="_blank" rel="noopener noreferrer">{text.botFaq}</a>);
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { from: 'user', text: input, timestamp: new Date() }]);
        const lowerInput = input.toLowerCase();
        let response = text.botThanks;
        if (lowerInput.includes('giá') || lowerInput.includes('price')) {
            response = text.botAskPrice;
        } else if (lowerInput.includes('visa')) {
            response = <div>
                <div>{text.botVisa}</div>
                <ul style={{margin:0,paddingLeft:18}}>
                    {visaOptions.map(v => <li key={v.url}><a href={v.url} target="_blank" rel="noopener noreferrer">{v.label}</a></li>)}
                </ul>
            </div>;
        }
        addBotMessage(response);
        setInput('');
    };

    useEffect(() => {
        if (showChatBox) {
            setTimeout(() => setIsVisible(true), 50);
        } else {
            setIsVisible(false);
            setShowTourList(false);
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
                    {text.chatWithUs}
                </div>
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
                    aria-label="Mở chatbox"
                    title={text.chatWithUs}
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
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>Hop On Hop Off</div>
                            <div style={{ fontSize: 12, opacity: 0.8 }}>{lang === 'VN' ? 'Tư vấn viên du lịch' : 'Travel Consultant'}</div>
                        </div>
                    </div>
                    {/* Ngôn ngữ */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button
                            onClick={() => setLang('VN')}
                            style={{
                                background: lang === 'VN' ? '#fff' : 'rgba(255,255,255,0.2)',
                                color: lang === 'VN' ? '#d90429' : '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '4px 10px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: 13,
                                boxShadow: lang === 'VN' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                outline: lang === 'VN' ? '2px solid #d90429' : 'none'
                            }}
                        >VN</button>
                        <button
                            onClick={() => setLang('EN')}
                            style={{
                                background: lang === 'EN' ? '#fff' : 'rgba(255,255,255,0.2)',
                                color: lang === 'EN' ? '#d90429' : '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '4px 10px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: 13,
                                boxShadow: lang === 'EN' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                                outline: lang === 'EN' ? '2px solid #d90429' : 'none'
                            }}
                        >EN</button>
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
                            justifyContent: 'center',
                            marginLeft: 8
                        }}
                        aria-label="Đóng chatbox"
                    >
                        ×
                    </button>
                </div>

                {/* Chat Window */}
                <div ref={chatWindowRef} style={{
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
                                textAlign: 'left'
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
                            <div style={{ fontWeight: 600, marginBottom: 12, color: '#374151' }}>{text.filterTitle}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <input
                                    type="text"
                                    placeholder={text.filterName}
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
                                    <option value="">{text.filterType}</option>
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
                                        {text.max}: {tourFilter.price ? (isNaN(tourFilter.price) ? tourFilter.price : `$${tourFilter.price}`) : (maxPrice ? `$${maxPrice}` : 'N/A')}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    placeholder={text.filterLocation}
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
                                    {text.filterResult}
                                </div>
                                {isLoading ? (
                                    <div style={{ textAlign: 'center', color: '#007bff', padding: 24 }}>
                                        <span style={{ fontSize: 28, display: 'block', marginBottom: 8 }}>⏳</span>
                                        {text.filterLoading}
                                    </div>
                                ) : filteredTours.length === 0 ? (
                                    <div style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: 24 }}>
                                        <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>😕</span>
                                        {text.filterNoResult}<br />
                                        <span style={{ fontSize: 13, color: '#aaa' }}>{text.filterNoResult}</span>
                                    </div>
                                ) : (
                                    <>
                                        {filteredTours.slice(0, visibleCount).map((tour, idx) => {
                                            const isTitleLong = tour.title && tour.title.length > 40;
                                            return (
                                                <div
                                                    key={tour.url}
                                                    style={{
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: 10,
                                                        padding: 14,
                                                        marginBottom: 12,
                                                        background: '#fff',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                                        transition: 'box-shadow 0.2s',
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        minHeight: 60
                                                    }}
                                                    onClick={() => window.open(tour.url, '_blank')}
                                                    onMouseEnter={() => setHoveredTitleId(idx)}
                                                    onMouseLeave={() => setHoveredTitleId(null)}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <div style={{ fontWeight: 600, fontSize: 15, color: '#d90429', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260, position: 'relative' }}
                                                            title={isTitleLong ? tour.title : undefined}
                                                        >
                                                            {tour.title && tour.title.length > 40 ? (
                                                                <span
                                                                    style={{ borderBottom: '1px dotted #888', cursor: 'help' }}
                                                                    title={tour.title}
                                                                >
                                                                    {tour.title.slice(0, 40) + '...'}
                                                                </span>
                                                            ) : tour.title}
                                                        </div>
                                                        {tour.tour_type && <span style={{ fontSize: 12, color: '#fff', background: '#d90429', borderRadius: 6, padding: '2px 8px', marginLeft: 6 }}>{tour.tour_type}</span>}
                                                    </div>
                                                    <div style={{ fontSize: 13, color: '#374151', margin: '6px 0 2px 0', minHeight: 18 }}>
                                                        {tour.description && tour.description.length > 80 ? tour.description.slice(0, 80) + '...' : tour.description}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6 }}>
                                                        {tour.duration && <span title={text.duration} style={{ fontSize: 12, color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}><span role="img" aria-label="clock">⏱️</span> {tour.duration}</span>}
                                                        {tour.price && <span title={text.price} style={{ fontSize: 13, color: '#007bff', fontWeight: 600, marginLeft: 8 }}>{tour.price}</span>}
                                                        <a
                                                            href={tour.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                marginLeft: 'auto',
                                                                fontSize: 13,
                                                                color: '#fff',
                                                                background: '#007bff',
                                                                borderRadius: 6,
                                                                padding: '4px 10px',
                                                                textDecoration: 'none',
                                                                fontWeight: 500
                                                            }}
                                                            onClick={e => e.stopPropagation()}
                                                        >
                                                            {text.seeDetail}
                                                        </a>
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
                                                {text.filterShowMore}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

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
                            >
                                {q.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setMessages([{ from: 'bot', text: text.welcome, timestamp: new Date() }])}
                            style={{
                                padding: '8px 12px',
                                borderRadius: 20,
                                border: '1px solid #e5e7eb',
                                background: '#fff0f0',
                                color: '#d90429',
                                fontWeight: 500,
                                fontSize: 13,
                                cursor: 'pointer',
                                marginLeft: 4
                            }}
                            aria-label={lang === 'VN' ? 'Xóa lịch sử chat' : 'Clear chat history'}
                            title={lang === 'VN' ? 'Xóa lịch sử chat' : 'Clear chat history'}
                        >
                            🧹 {lang === 'VN' ? 'Xóa chat' : 'Clear chat'}
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder={text.chatPlaceholder}
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

export default ChatBoxCrawl;