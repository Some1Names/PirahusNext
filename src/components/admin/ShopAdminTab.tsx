"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaPencilAlt, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { shopItemService } from "@/src/infra/container";
import type { ShopItemEntity, CreateShopItemInput } from "@/src/core/domain/shop-item";
import type { ShopCategory } from "@/src/lib/shop/Types";

export default function ShopAdminTab() {
  const [items, setItems] = useState<ShopItemEntity[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItemEntity | null>(null);

  // Form State
  const [category, setCategory] = useState<ShopCategory>("cosmetic");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [icon, setIcon] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [effectKey, setEffectKey] = useState("");
  const [hintLevel, setHintLevel] = useState(0);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await shopItemService.getAllShopItems();
      setItems(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "ไม่สามารถดึงข้อมูลสินค้าได้", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setEditingItem(null);
    setCategory("cosmetic");
    setName("");
    setDescription("");
    setPrice(0);
    setIcon("");
    setDisabled(false);
    setEffectKey("");
    setHintLevel(0);
  };

  const openModal = (item?: ShopItemEntity) => {
    if (item) {
      setEditingItem(item);
      setCategory(item.category);
      setName(item.name);
      setDescription(item.description);
      setPrice(item.price);
      setIcon(item.icon);
      setDisabled(item.disabled);
      setEffectKey(item.effectKey || "");
      setHintLevel(item.hintLevel || 0);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateShopItemInput = {
      category,
      name,
      description,
      price,
      icon,
      disabled,
      effectKey: effectKey.trim() !== "" ? (effectKey as any) : null,
      hintLevel: hintLevel > 0 ? hintLevel : null,
    };

    try {
      if (editingItem) {
        await shopItemService.updateShopItem(editingItem.id, payload);
        Swal.fire("สำเร็จ", "อัปเดตสินค้าสำเร็จ", "success");
      } else {
        await shopItemService.createShopItem(payload);
        Swal.fire("สำเร็จ", "สร้างสินค้าใหม่สำเร็จ", "success");
      }
      closeModal();
      fetchItems();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "เกิดข้อผิดพลาดในการบันทึก", "error");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ",
      text: `คุณต้องการลบสินค้า ${name} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await shopItemService.deleteShopItem(id);
        Swal.fire("Deleted!", "ลบสินค้าสำเร็จ", "success");
        fetchItems();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "ลบสินค้าไม่สำเร็จ", "error");
      }
    }
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "20px", color: "#d8e8b8", fontWeight: "bold" }}>จัดการร้านค้า (Shop Items)</h2>
        <button
          onClick={() => openModal()}
          style={{
            background: "#4a7a38",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaPlus /> เพิ่มสินค้า
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#8aaccc" }}>Loading...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#c8d4a8", fontSize: "14px" }}>
            <thead>
              <tr style={{ background: "#101810", borderBottom: "1px solid #2a3a18", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Icon</th>
                <th style={{ padding: "12px" }}>Category</th>
                <th style={{ padding: "12px" }}>Name</th>
                <th style={{ padding: "12px" }}>Price</th>
                <th style={{ padding: "12px" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #1a2a12" }}>
                  <td style={{ padding: "12px", fontSize: "24px" }}>{item.icon}</td>
                  <td style={{ padding: "12px", textTransform: "capitalize" }}>{item.category}</td>
                  <td style={{ padding: "12px" }}>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: "12px", color: "#8aaccc" }}>{item.description}</div>
                  </td>
                  <td style={{ padding: "12px", color: "#ffd66b" }}>{item.price} pts</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ 
                      color: item.disabled ? "#ff6b6b" : "#6dff9e",
                      padding: "4px 8px",
                      background: item.disabled ? "#2a0808" : "#082a12",
                      borderRadius: "12px",
                      fontSize: "12px"
                    }}>
                      {item.disabled ? "Disabled" : "Active"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <button onClick={() => openModal(item)} style={{ background: "transparent", border: "none", color: "#4a9eff", cursor: "pointer", marginRight: "12px" }}>
                      <FaPencilAlt />
                    </button>
                    <button onClick={() => handleDelete(item.id, item.name)} style={{ background: "transparent", border: "none", color: "#ff6b6b", cursor: "pointer" }}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "#5a7a38" }}>ไม่มีสินค้า</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.7)", zIndex: 1000,
          display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{
            background: "#0d130f",
            border: "1px solid #2a3a18",
            borderRadius: "8px",
            width: "90%", maxWidth: "500px",
            maxHeight: "90vh", overflowY: "auto",
            padding: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "#d8e8b8", fontSize: "18px" }}>
                {editingItem ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
              </h3>
              <button onClick={closeModal} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: "18px" }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", color: "#8aaccc", marginBottom: "8px", fontSize: "14px" }}>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as ShopCategory)} style={{ width: "100%", padding: "10px", background: "#060a08", border: "1px solid #2a3a18", color: "#d8e8b8" }} required>
                  <option value="cosmetic">Cosmetic</option>
                  <option value="hint">Hint</option>
                  <option value="spin">Spin</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", color: "#8aaccc", marginBottom: "8px", fontSize: "14px" }}>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: "10px", background: "#060a08", border: "1px solid #2a3a18", color: "#d8e8b8" }} />
              </div>

              <div>
                <label style={{ display: "block", color: "#8aaccc", marginBottom: "8px", fontSize: "14px" }}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: "10px", background: "#060a08", border: "1px solid #2a3a18", color: "#d8e8b8", minHeight: "80px" }} />
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", color: "#8aaccc", marginBottom: "8px", fontSize: "14px" }}>Price (pts)</label>
                  <input type="number" min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} required style={{ width: "100%", padding: "10px", background: "#060a08", border: "1px solid #2a3a18", color: "#d8e8b8" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", color: "#8aaccc", marginBottom: "8px", fontSize: "14px" }}>Icon (Emoji/URL)</label>
                  <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} required style={{ width: "100%", padding: "10px", background: "#060a08", border: "1px solid #2a3a18", color: "#d8e8b8" }} />
                </div>
              </div>

              {category === "cosmetic" && (
                <div>
                  <label style={{ display: "block", color: "#8aaccc", marginBottom: "8px", fontSize: "14px" }}>Effect Key</label>
                  <input type="text" value={effectKey} onChange={(e) => setEffectKey(e.target.value)} placeholder="e.g. ribbons, click-spark" style={{ width: "100%", padding: "10px", background: "#060a08", border: "1px solid #2a3a18", color: "#d8e8b8" }} />
                </div>
              )}

              {category === "hint" && (
                <div>
                  <label style={{ display: "block", color: "#8aaccc", marginBottom: "8px", fontSize: "14px" }}>Hint Level (1-5)</label>
                  <input type="number" min="1" max="5" value={hintLevel} onChange={(e) => setHintLevel(Number(e.target.value))} style={{ width: "100%", padding: "10px", background: "#060a08", border: "1px solid #2a3a18", color: "#d8e8b8" }} />
                </div>
              )}

              <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#d8e8b8", cursor: "pointer", marginTop: "8px" }}>
                <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
                <span>ปิดใช้งาน (Disabled)</span>
              </label>

              <button type="submit" style={{ marginTop: "16px", background: "#d45c2a", color: "#fff", border: "none", padding: "12px", borderRadius: "4px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
                บันทึกข้อมูล
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
