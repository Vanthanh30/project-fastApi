import React from "react";
import LayoutDefault from "../layout_default/layout_default";
import "./story.scss";

const Story = () => {
  return (
    <LayoutDefault>
      <div className="story">

        {/* HERO */}
        <section className="story__hero">
          <div className="story__hero-overlay">
            <span className="story__tagline">TRIẾT LÝ CỦA CHÚNG TÔI</span>
            <h1>
              Sang Trọng Thuần Khiết<br />
              Đột Phá Khoa Học
            </h1>
            <p>
              Hành trình kiến tạo vẻ đẹp bắt nguồn từ khoa học và sự tinh tế.
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section className="story__section story__intro">
          <div className="story__text">
            <h2>Câu Chuyện Thương Hiệu</h2>
            <p>
              LUMIÈRE được sinh ra từ khát vọng tạo nên một thương hiệu mỹ phẩm
              cao cấp – nơi vẻ đẹp không chỉ đến từ bên ngoài mà còn được nuôi
              dưỡng từ sâu bên trong làn da.
            </p>
            <p>
              Chúng tôi kết hợp khoa học hiện đại, thành phần tinh khiết và triết
              lý làm đẹp bền vững để mang đến trải nghiệm chăm sóc da đẳng cấp.
            </p>
          </div>
          <div className="story__image">
            <img
              src="https://images.unsplash.com/photo-1580870069867-74c57ee1bb07"
              alt="Brand story"
            />
          </div>
        </section>

        {/* MISSION */}
        <section className="story__section story__reverse">
          <div className="story__image">
            <img
              src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908"
              alt="Mission"
            />
          </div>
          <div className="story__text">
            <h2>Sứ Mệnh</h2>
            <p>
              Chúng tôi tin rằng vẻ đẹp thực sự đến từ sự tự tin và làn da khỏe
              mạnh. Mỗi sản phẩm LUMIÈRE đều trải qua quy trình nghiên cứu và
              kiểm nghiệm nghiêm ngặt.
            </p>
            <p>
              Công nghệ tiên tiến kết hợp cùng thành phần an toàn là nền tảng
              cho mọi sáng tạo của chúng tôi.
            </p>
          </div>
        </section>

        {/* VALUES */}
        <section className="story__values">
          <h2>Giá Trị Cốt Lõi</h2>
          <div className="story__values-grid">
            <div className="value-card">
              <h3>🌿 Tinh Khiết</h3>
              <p>Thành phần an toàn, lành tính cho mọi loại da.</p>
            </div>
            <div className="value-card">
              <h3>🧪 Khoa Học</h3>
              <p>Ứng dụng công nghệ hiện đại trong từng công thức.</p>
            </div>
            <div className="value-card">
              <h3>✨ Sang Trọng</h3>
              <p>Trải nghiệm tinh tế từ thiết kế đến cảm giác sử dụng.</p>
            </div>
          </div>
        </section>

      </div>
    </LayoutDefault>
  );
};

export default Story;
