import React, { useEffect, useRef } from "react";
import { Sparkles, Microscope, Crown, Heart, Globe, Award } from "lucide-react";
import LayoutDefault from "../layout_default/layout_default";
import "./story.scss";

const Story = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in").forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <LayoutDefault>
      <div className="story">
        {/* HERO */}
        <section className="story__hero">
          <div className="story__hero-overlay">
            <span className="story__tagline fade-in">TRIẾT LÝ CỦA CHÚNG TÔI</span>
            <h1 className="fade-in">
              Sang Trọng Thuần Khiết<br />
              Đột Phá Khoa Học
            </h1>
            <p className="fade-in">
              Hành trình kiến tạo vẻ đẹp bắt nguồn từ khoa học và sự tinh tế,
              nơi mỗi sản phẩm là tác phẩm nghệ thuật được chăm chút tỉ mỉ.
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section className="story__section story__intro">
          <div className="story__text fade-in">
            <h2>Câu Chuyện Thương Hiệu</h2>
            <p>
              LUMIÈRE được sinh ra từ khát vọng tạo nên một thương hiệu mỹ phẩm
              cao cấp – nơi vẻ đẹp không chỉ đến từ bên ngoài mà còn được nuôi
              dưỡng từ sâu bên trong làn da. Chúng tôi tin rằng mỗi người phụ nữ
              đều xứng đáng được trải nghiệm sự chăm sóc tốt nhất, với những sản
              phẩm không chỉ mang lại hiệu quả rõ rệt mà còn là khoảnh khắc thư
              giãn đích thực trong cuộc sống bận rộn.
            </p>
            <p>
              Hành trình của chúng tôi bắt đầu từ năm 2018, khi đội ngũ các nhà
              khoa học da liễu và chuyên gia thẩm mỹ hàng đầu quyết tâm kết hợp
              khoa học hiện đại với nghệ thuật làm đẹp truyền thống. Mỗi công thức
              đều trải qua hàng nghìn giờ nghiên cứu, thử nghiệm lâm sàng nghiêm
              ngặt và được chứng minh hiệu quả trên đa dạng loại da.
            </p>
            <p>
              Từ những thành phần tinh khiết được tuyển chọn kỹ lưỡng đến bao bì
              sang trọng, mọi chi tiết đều phản ánh cam kết của chúng tôi với sự
              hoàn hảo và triết lý làm đẹp bền vững.
            </p>
          </div>
          <div className="story__image fade-in">
            <img
              src="https://images.unsplash.com/photo-1580870069867-74c57ee1bb07"
              alt="Brand story"
            />
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="story__philosophy fade-in">
          <div className="story__philosophy-content">
            <h2>Triết Lý Làm Đẹp</h2>
            <p className="philosophy-lead">
              Vẻ đẹp thực sự không đến từ việc che giấu khuyết điểm, mà là việc
              nuôi dưỡng và tôn vinh làn da khỏe mạnh tự nhiên của bạn.
            </p>
            <div className="philosophy-grid">
              <div className="philosophy-item">
                <h3>Chăm Sóc Từ Bên Trong</h3>
                <p>
                  Chúng tôi không chỉ tập trung vào bề mặt da mà đi sâu vào việc
                  phục hồi và cân bằng các lớp da sâu. Mỗi sản phẩm được thiết kế
                  để kích hoạt khả năng tự phục hồi tự nhiên của da, mang lại vẻ
                  đẹp bền vững và rạng rỡ từ bên trong.
                </p>
              </div>
              <div className="philosophy-item">
                <h3>Khoa Học Tạo Nên Sự Khác Biệt</h3>
                <p>
                  Với đội ngũ nghiên cứu hàng đầu và phòng thí nghiệm hiện đại,
                  chúng tôi liên tục khám phá những đột phá mới trong công nghệ
                  chăm sóc da. Từ peptide thế hệ mới đến các phức hợp thực vật
                  được chiết xuất bằng công nghệ sinh học, mỗi thành phần đều có
                  cơ sở khoa học vững chắc.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION */}
        <section className="story__section story__reverse">
          <div className="story__image fade-in">
            <img
              src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908"
              alt="Mission"
            />
          </div>
          <div className="story__text fade-in">
            <h2>Sứ Mệnh</h2>
            <p>
              Sứ mệnh của LUMIÈRE là mang đến cho phụ nữ Việt Nam những sản phẩm
              chăm sóc da đẳng cấp quốc tế với chất lượng được kiểm chứng. Chúng
              tôi tin rằng vẻ đẹp thực sự đến từ sự tự tin và làn da khỏe mạnh,
              và mỗi người phụ nữ đều xứng đáng được trải nghiệm điều đó.
            </p>
            <p>
              Mỗi sản phẩm LUMIÈRE đều trải qua quy trình nghiên cứu và kiểm
              nghiệm nghiêm ngặt tại các phòng thí nghiệm được chứng nhận quốc tế.
              Chúng tôi hợp tác với các chuyên gia da liễu hàng đầu để đảm bảo
              hiệu quả và độ an toàn tối đa cho mọi loại da, kể cả da nhạy cảm.
            </p>
            <p>
              Công nghệ tiên tiến như nano-encapsulation, công nghệ vi nang phân
              tử và các hệ thống truyền tải hoạt chất thế hệ mới được ứng dụng để
              tối ưu hóa khả năng thấm sâu và hiệu quả của mỗi sản phẩm. Kết hợp
              cùng thành phần thiên nhiên an toàn, đây là nền tảng cho mọi sáng
              tạo của chúng tôi.
            </p>
          </div>
        </section>

        {/* COMMITMENT */}
        <section className="story__commitment fade-in">
          <h2>Cam Kết Của Chúng Tôi</h2>
          <div className="commitment-grid">
            <div className="commitment-card">
              <div className="commitment-icon">
                <Heart size={32} />
              </div>
              <h3>An Toàn Tuyệt Đối</h3>
              <p>
                Không chứa paraben, sulfate, phthalate hay bất kỳ thành phần gây
                hại nào. Mỗi công thức đều được kiểm nghiệm da liễu và phù hợp
                với cả da nhạy cảm. Chúng tôi cam kết minh bạch 100% về thành
                phần và quy trình sản xuất.
              </p>
            </div>
            <div className="commitment-card">
              <div className="commitment-icon">
                <Globe size={32} />
              </div>
              <h3>Bền Vững & Trách Nhiệm</h3>
              <p>
                Chúng tôi không thử nghiệm trên động vật và ưu tiên các thành
                phần có nguồn gốc bền vững. Bao bì của chúng tôi có thể tái chế
                và chúng tôi liên tục tìm kiếm các giải pháp thân thiện với môi
                trường hơn. Mỗi sản phẩm bán ra đều đóng góp vào các dự án bảo
                vệ môi trường.
              </p>
            </div>
            <div className="commitment-card">
              <div className="commitment-icon">
                <Award size={32} />
              </div>
              <h3>Chất Lượng Đẳng Cấp</h3>
              <p>
                Từ khâu tuyển chọn nguyên liệu thô đến quy trình sản xuất, mọi
                bước đều tuân thủ tiêu chuẩn GMP quốc tế. Đội ngũ kiểm soát chất
                lượng của chúng tôi đảm bảo mỗi sản phẩm đến tay bạn đều đạt
                tiêu chuẩn cao nhất về độ tinh khiết, hiệu quả và sự sang trọng.
              </p>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="story__values">
          <h2>Giá Trị Cốt Lõi</h2>
          <p className="values-intro fade-in">
            Ba trụ cột định hình mọi quyết định và sáng tạo của chúng tôi
          </p>
          <div className="story__values-grid">
            <div className="value-card fade-in">
              <div className="value-icon">
                <Sparkles size={40} strokeWidth={1.5} />
              </div>
              <h3>Tinh Khiết</h3>
              <p>
                Chúng tôi tin vào sức mạnh của sự đơn giản và tinh khiết. Mỗi
                thành phần được lựa chọn cẩn thận vì công dụng cụ thể và khả năng
                phối hợp hoàn hảo. Không có chất độn, không có mùi hương tổng hợp
                không cần thiết - chỉ có những gì làn da bạn thực sự cần để phát
                triển khỏe mạnh và rạng rỡ.
              </p>
            </div>
            <div className="value-card fade-in">
              <div className="value-icon">
                <Microscope size={40} strokeWidth={1.5} />
              </div>
              <h3>Khoa Học</h3>
              <p>
                Mỗi công thức là kết quả của hàng năm nghiên cứu và phát triển.
                Chúng tôi ứng dụng những tiến bộ mới nhất trong công nghệ sinh
                học, hóa học mỹ phẩm và khoa học da liễu để tạo ra những sản phẩm
                không chỉ an toàn mà còn mang lại hiệu quả vượt trội, được chứng
                minh qua các thử nghiệm lâm sàng độc lập.
              </p>
            </div>
            <div className="value-card fade-in">
              <div className="value-icon">
                <Crown size={40} strokeWidth={1.5} />
              </div>
              <h3>Sang Trọng</h3>
              <p>
                Trải nghiệm LUMIÈRE bắt đầu từ khoảnh khắc bạn mở sản phẩm. Từ
                thiết kế bao bì tinh tế, kết cấu mịn màng đến hương thơm thanh
                lịch - mọi chi tiết đều được chăm chút để mang đến cảm giác sang
                trọng và đặc biệt. Đây không chỉ là chăm sóc da, mà là nghi thức
                làm đẹp đẳng cấp mà bạn xứng đáng được trải nghiệm mỗi ngày.
              </p>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="story__closing fade-in">
          <div className="closing-content">
            <h2>Hành Trình Cùng Bạn</h2>
            <p>
              LUMIÈRE không chỉ là một thương hiệu mỹ phẩm. Chúng tôi là người
              đồng hành trong hành trình chăm sóc và tôn vinh vẻ đẹp tự nhiên của
              bạn. Mỗi sản phẩm được tạo ra với tình yêu, sự tận tâm và cam kết
              mang đến cho bạn những gì tốt nhất.
            </p>
            <p>
              Hãy để chúng tôi cùng bạn viết nên câu chuyện vẻ đẹp của riêng bạn
              - một câu chuyện về sự tự tin, rạng rỡ và yêu thương bản thân.
            </p>
          </div>
        </section>
      </div>
    </LayoutDefault>
  );
};

export default Story;