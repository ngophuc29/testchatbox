import { useState, useMemo } from "react";

export default function ProductForm() {
    // Mảng có sẵn sản phẩm
    const [products, setProducts] = useState([
        { name: "Sản phẩm A", price: 100000 },
        { name: "Sản phẩm B", price: 200000 },
    ]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    // Tính tổng giá, dùng useMemo để tối ưu
    // const totalPrice =  () => {
    //     console.log("Đang tính tổng giá...");
    //     return products.reduce((sum, p) => sum + p.price, 0);
    // };
    
    
    // Tính tổng giá, dùng useMemo để tối ưu ,hàm chỉ chạy mỗi khi mà 
    // products nó thay đổi 
    const totalPrice = useMemo(() => {
        console.log("Đang tính tổng giá...");
        return products.reduce((sum, p) => sum + p.price, 0);
    },[products]);

    const handleAddProduct = () => {
        if (!name || !price) {
            alert("Vui lòng nhập tên và giá!");
            return;
        }

        const newProduct = {
            name,
            price: parseFloat(price),
        };

        setProducts([...products, newProduct]);
        setName("");
        setPrice("");
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>🛒 Danh sách sản phẩm</h2>
            <ul>
                {products.map((p, index) => (
                    <li key={index}>
                        {p.name} - {p.price.toLocaleString()} VND
                    </li>
                ))}
            </ul>

            {/* <h3>🧮 Tổng: {totalPrice() } VND</h3> */}
            <h3>🧮 Tổng: {totalPrice} VND</h3>


            <div style={{ marginTop: 20 }}>
                <h4>➕ Thêm sản phẩm mới</h4>
                <input
                    type="text"
                    placeholder="Tên sản phẩm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginRight: 10 }}
                />
                <input
                    type="number"
                    placeholder="Giá"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ marginRight: 10 }}
                />
                <button onClick={handleAddProduct}>Thêm</button>
            </div>
        </div>
    );
}
