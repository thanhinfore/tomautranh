# TÀI LIỆU YÊU CẦU PHẦN MỀM
## Ứng dụng Tô Màu Tranh Trực Tuyến

### 1. TỔNG QUAN DỰ ÁN

#### 1.1 Mục đích
Phát triển ứng dụng web cho phép người dùng tô màu các bức tranh đen trắng một cách tương tác trên nhiều thiết bị (desktop, tablet, mobile).

#### 1.2 Phạm vi
- Platform: Web responsive (HTML5/CSS3/JavaScript thuần)
- Thiết bị hỗ trợ: Desktop (Chrome, Firefox, Safari, Edge), Mobile (iOS Safari, Chrome Android)
- Không yêu cầu cài đặt, chạy trực tiếp trên trình duyệt

#### 1.3 Định nghĩa và từ viết tắt
- **Canvas**: HTML5 Canvas element để vẽ đồ họa
- **Flood Fill**: Thuật toán tô màu vùng kín
- **SVG**: Scalable Vector Graphics
- **PWA**: Progressive Web App

### 2. YÊU CẦU CHỨC NĂNG

#### 2.1 Chức năng cốt lõi

##### F001: Tải và hiển thị tranh
- Hỗ trợ định dạng: PNG, JPG, SVG
- Tự động phát hiện vùng tô màu (contour detection)
- Chuyển đổi ảnh màu thành line art nếu cần
- Gallery mẫu có sẵn (10-20 tranh)

##### F002: Bảng màu
- Palette màu cơ bản (24 màu)
- Color picker tùy chỉnh
- Lưu màu yêu thích (max 12)
- Hiển thị màu đang chọn
- Eyedropper tool để lấy màu từ tranh

##### F003: Tô màu
- Click/tap để tô màu vùng kín
- Flood fill algorithm với tolerance điều chỉnh
- Hỗ trợ gradient fill (nâng cao)
- Preview màu khi hover (desktop)

##### F004: Công cụ vẽ
- Brush tool với kích thước điều chỉnh (1-50px)
- Eraser tool
- Paint bucket (flood fill)
- Zoom in/out (25%-400%)
- Pan tool để di chuyển canvas

##### F005: Undo/Redo
- Lịch sử 50 bước
- Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- Clear all với xác nhận

##### F006: Lưu và chia sẻ
- Lưu tạm vào localStorage
- Export PNG/JPG với chất lượng tùy chọn
- Chia sẻ qua social media (URL share)
- Tải về thiết bị

#### 2.2 Chức năng nâng cao

##### F007: Layers
- Tối đa 5 layers
- Opacity điều chỉnh cho mỗi layer
- Blend modes cơ bản

##### F008: Effects
- Blur effect
- Shadow/glow
- Texture overlays

##### F009: Multiplayer
- Tô màu cùng nhau real-time
- Chat trong phòng
- Lưu lịch sử người tham gia

### 3. YÊU CẦU PHI CHỨC NĂNG

#### 3.1 Hiệu năng
- **NFR001**: Thời gian tải trang < 3 giây (3G network)
- **NFR002**: Flood fill < 100ms cho ảnh 1920x1080
- **NFR003**: Smooth drawing ở 60 FPS
- **NFR004**: Hỗ trợ canvas lên đến 4096x4096 pixels

#### 3.2 Khả năng sử dụng
- **NFR005**: Responsive design cho màn hình 320px - 4K
- **NFR006**: Touch gestures cho mobile (pinch zoom, 2-finger pan)
- **NFR007**: Keyboard navigation hỗ trợ accessibility
- **NFR008**: Tutorial cho người dùng mới

#### 3.3 Độ tin cậy
- **NFR009**: Auto-save mỗi 30 giây
- **NFR010**: Recovery sau khi browser crash
- **NFR011**: Offline mode với service worker

#### 3.4 Bảo mật
- **NFR012**: Validate input files (size < 10MB, format check)
- **NFR013**: Sanitize user-generated content
- **NFR014**: CORS policy cho image loading
- **NFR015**: Rate limiting cho API calls

#### 3.5 Tương thích
- **NFR016**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **NFR017**: iOS 13+, Android 8+
- **NFR018**: Fallback cho browsers không hỗ trợ

### 4. KIẾN TRÚC KỸ THUẬT

#### 4.1 Frontend Architecture
```
/src
├── /assets
│   ├── /images     # Sample coloring pages
│   ├── /icons      # UI icons
│   └── /fonts      # Custom fonts
├── /css
│   ├── main.css    # Main styles
│   ├── mobile.css  # Mobile specific
│   └── print.css   # Print styles
├── /js
│   ├── app.js      # Main application
│   ├── canvas.js   # Canvas operations
│   ├── colorpicker.js
│   ├── floodfill.js
│   ├── history.js  # Undo/redo manager
│   ├── storage.js  # LocalStorage handler
│   └── utils.js
└── index.html
```

#### 4.2 Data Structure
```javascript
// Coloring Session
{
  id: "uuid",
  imageUrl: "base64/url",
  dimensions: { width, height },
  layers: [
    {
      id: "layer-id",
      data: ImageData,
      opacity: 1.0,
      visible: true
    }
  ],
  history: [
    {
      action: "fill/draw/erase",
      data: {...},
      timestamp: Date
    }
  ],
  palette: ["#FF0000", "#00FF00", ...],
  metadata: {
    created: Date,
    modified: Date,
    title: String
  }
}
```

#### 4.3 Algorithms

##### Flood Fill Algorithm
```javascript
// Scanline flood fill với stack
function floodFill(x, y, targetColor, fillColor, tolerance) {
  // 1. Check boundaries
  // 2. Get pixel color
  // 3. Compare với tolerance
  // 4. Fill horizontal line
  // 5. Check lines above/below
  // 6. Add to stack
  // 7. Repeat
}
```

### 5. GIAO DIỆN NGƯỜI DÙNG

#### 5.1 Desktop Layout
```
┌─────────────────────────────────────┐
│  Header (Logo, Menu, Save)          │
├──────┬──────────────────────┬───────┤
│      │                      │       │
│ Tool │   Canvas Area        │ Color │
│ Bar  │   (Zoomable)         │Palette│
│      │                      │       │
├──────┴──────────────────────┴───────┤
│  Footer (Zoom, Undo/Redo)           │
└─────────────────────────────────────┘
```

#### 5.2 Mobile Layout
```
┌─────────────┐
│   Header    │
├─────────────┤
│             │
│   Canvas    │
│             │
├─────────────┤
│Color Palette│
├─────────────┤
│  Tool Bar   │
└─────────────┘
```

### 6. TEST SCENARIOS

#### 6.1 Functional Tests
- **TC001**: Upload image và detect edges
- **TC002**: Flood fill với các tolerance levels
- **TC003**: Undo/redo 50 operations
- **TC004**: Save/load từ localStorage
- **TC005**: Export các định dạng
- **TC006**: Zoom/pan operations
- **TC007**: Touch gestures trên mobile

#### 6.2 Performance Tests
- **TC008**: Fill large area (>500K pixels)
- **TC009**: Multiple layers rendering
- **TC010**: Memory usage với canvas 4K

#### 6.3 Compatibility Tests
- **TC011**: Cross-browser testing
- **TC012**: Responsive breakpoints
- **TC013**: Touch vs mouse events

### 7. MILESTONES & DELIVERABLES

#### Phase 1: MVP (2 tuần)
- Basic canvas setup
- Flood fill implementation
- Color palette
- Save/load localStorage

#### Phase 2: Enhanced (1 tuần)
- Undo/redo
- Zoom/pan
- Mobile optimization
- Gallery

#### Phase 3: Polish (1 tuần)
- Performance optimization
- PWA features
- Testing & bug fixes
- Documentation

### 8. RISKS & MITIGATION

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Flood fill performance issues | High | Medium | Implement web workers |
| Browser compatibility | Medium | Low | Polyfills và fallbacks |
| Memory leaks với large canvas | High | Medium | Canvas recycling, dispose properly |
| Touch accuracy trên mobile | Medium | High | Zoom feature, larger touch targets |

### 9. DEPENDENCIES

#### External Libraries (Optional)
- **None required** (vanilla JS implementation)
- Optional enhancements:
  - FileSaver.js cho download
  - Pica.js cho image resizing
  - Workbox cho PWA

### 10. ACCEPTANCE CRITERIA

- Tô màu mượt mà không lag trên thiết bị mid-range
- Hỗ trợ ít nhất 95% browsers theo caniuse.com
- Load time < 3s trên 3G
- No memory leaks sau 1 giờ sử dụng
- Touch precision ±5px trên mobile
- Accessibility score > 90 (Lighthouse)

### 11. USER STORIES

#### 11.1 Epic: Người dùng tô màu tranh

**US001**: Là người dùng, tôi muốn chọn tranh từ thư viện có sẵn
- **Acceptance Criteria**:
  - Hiển thị ít nhất 20 tranh mẫu
  - Preview thumbnail trước khi chọn
  - Phân loại theo chủ đề (động vật, phong cảnh, mandala...)
  
**US002**: Là người dùng, tôi muốn tải tranh của riêng mình
- **Acceptance Criteria**:
  - Hỗ trợ drag & drop
  - Validate định dạng và kích thước
  - Tự động convert sang line art nếu cần

**US003**: Là người dùng, tôi muốn tô màu bằng cách tap/click vào vùng
- **Acceptance Criteria**:
  - Tô màu tức thì < 100ms
  - Không tràn ra ngoài đường viền
  - Hỗ trợ undo nếu tô sai

**US004**: Là người dùng, tôi muốn lưu và tiếp tục sau
- **Acceptance Criteria**:
  - Auto-save mỗi 30 giây
  - Khôi phục đúng trạng thái
  - Không mất dữ liệu khi refresh

**US005**: Là người dùng, tôi muốn chia sẻ tác phẩm
- **Acceptance Criteria**:
  - Export chất lượng cao
  - Share link trực tiếp
  - Watermark tùy chọn

#### 11.2 Epic: Công cụ vẽ nâng cao

**US006**: Là người dùng nâng cao, tôi muốn dùng brush để vẽ tự do
- **Acceptance Criteria**:
  - Brush size 1-50px
  - Pressure sensitivity (nếu có stylus)
  - Smooth stroke rendering

**US007**: Là người dùng, tôi muốn mix màu và tạo gradient
- **Acceptance Criteria**:
  - Color mixing tool
  - Gradient fill với 2+ màu
  - Opacity control

### 12. USE CASES

#### UC001: Tô màu cơ bản
**Actor**: Người dùng
**Precondition**: Ứng dụng đã load, tranh đã chọn
**Main Flow**:
1. Người dùng chọn màu từ palette
2. Người dùng click/tap vào vùng cần tô
3. Hệ thống thực hiện flood fill
4. Vùng được tô màu hiển thị
5. Lưu vào history để undo

**Alternative Flow**:
- 2a. Vùng không kín → Hiện cảnh báo
- 3a. Fill fail → Rollback và thông báo

#### UC002: Import tranh tùy chỉnh
**Actor**: Người dùng
**Precondition**: Người dùng có file ảnh
**Main Flow**:
1. Người dùng click "Upload"
2. Chọn file từ thiết bị
3. System validate file
4. Process và hiển thị preview
5. Người dùng confirm
6. Load tranh vào canvas

**Exception Flow**:
- 3a. File không hợp lệ → Báo lỗi
- 4a. Ảnh quá lớn → Đề nghị resize

### 13. BUSINESS REQUIREMENTS

#### 13.1 Mục tiêu kinh doanh
- **Người dùng mục tiêu**: 500,000 MAU trong năm đầu
- **Engagement**: Average session 15 phút
- **Retention**: 40% người dùng quay lại sau 7 ngày
- **Monetization**: 
  - Free tier: 5 tranh/ngày
  - Premium: Unlimited + exclusive content
  - Ads cho free users

#### 13.2 KPIs
- Daily Active Users (DAU)
- Tranh được tô màu/ngày
- Conversion rate free → premium
- App store rating > 4.5

#### 13.3 Competitive Analysis
| Feature | Our App | Competitor A | Competitor B |
|---------|---------|--------------|--------------|
| Offline mode | ✓ | ✗ | ✓ |
| Custom images | ✓ | Premium only | ✗ |
| Multiplayer | ✓ | ✗ | ✗ |
| No ads (free) | ✗ | ✗ | ✗ |
| Web-based | ✓ | App only | ✓ |

### 14. TECHNICAL SPECIFICATIONS

#### 14.1 Browser APIs Required
```javascript
// Core APIs
- Canvas 2D Context
- File API
- LocalStorage API  
- Touch Events API
- Pointer Events API
- Fullscreen API
- Web Workers (performance)
- Service Workers (offline)
```

#### 14.2 Performance Budget
- Initial load: < 200KB (gzipped)
- Time to Interactive: < 3s
- First Contentful Paint: < 1.5s
- Memory usage: < 150MB
- Battery drain: < 5%/hour

#### 14.3 Data Schema
```javascript
// User Profile
{
  userId: String,
  preferences: {
    defaultPalette: Array<Color>,
    brushSize: Number,
    autoSave: Boolean
  },
  stats: {
    completed: Number,
    timeSpent: Number,
    favoriteColors: Array
  }
}

// Artwork
{
  artworkId: String,
  originalImage: String(base64/url),
  colorLayers: Array<ImageData>,
  history: Array<Action>,
  metadata: {
    created: Timestamp,
    modified: Timestamp,
    shares: Number
  }
}
```

### 15. QUALITY ASSURANCE

#### 15.1 Test Coverage Requirements
- Unit tests: > 80% coverage
- Integration tests: Core workflows
- E2E tests: Critical user journeys
- Performance tests: Load & stress testing
- Usability tests: 10+ users

#### 15.2 Bug Severity Levels
- **P0 (Critical)**: App crash, data loss
- **P1 (High)**: Core feature broken
- **P2 (Medium)**: Feature degraded
- **P3 (Low)**: Cosmetic issues

#### 15.3 Device Testing Matrix
| Device Type | OS Versions | Browsers | Priority |
|-------------|------------|----------|----------|
| iPhone | iOS 14+ | Safari, Chrome | P0 |
| Android | 9+ | Chrome, Firefox | P0 |
| iPad | iPadOS 14+ | Safari | P1 |
| Desktop | Win 10+, Mac | Chrome, Edge, Firefox | P1 |

### 16. DEPLOYMENT & MAINTENANCE

#### 16.1 Deployment Strategy
- Environment: Static hosting (CDN)
- CI/CD: GitHub Actions
- Monitoring: Google Analytics + Sentry
- A/B Testing: Feature flags

#### 16.2 Update Schedule
- Bug fixes: Within 48 hours
- Minor updates: Bi-weekly
- Major features: Monthly
- Security patches: Immediate

### 17. COMPLIANCE & LEGAL

#### 17.1 Privacy Requirements
- GDPR compliance (EU users)
- COPPA compliance (under 13)
- Cookie consent banner
- Data deletion on request

#### 17.2 Content Guidelines
- No copyrighted images in gallery
- User-generated content moderation
- Terms of Service & Privacy Policy
- Age-appropriate content only

### 18. FUTURE ENHANCEMENTS (v2.0)

- AI-powered auto-coloring suggestions
- AR mode (color real world)
- Voice commands
- Cloud sync across devices
- Social features (follow, like, comment)
- Coloring competitions
- Educational mode with color theory
- API for third-party integrations
- Desktop app (Electron)
- Marketplace for custom coloring books
