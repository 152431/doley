# PC端物联网控制平台 - 技术架构文档

## 1. Architecture Design

```mermaid
graph TB
    subgraph Frontend["前端层"]
        A[React + TypeScript]
        B[Vite 构建工具]
        C[Tailwind CSS 样式]
        D[React Router 路由]
        E[Zustand 状态管理]
        F[Recharts 图表库]
        G[Lucide React 图标]
    end
    
    subgraph DataLayer["数据层"]
        H[Mock 数据]
        I[本地存储]
    end
    
    A --> D
    A --> E
    A --> F
    A --> G
    B --> A
    C --> A
    E --> H
    E --> I
```

## 2. Technology Description
- **Frontend**: React@18 + TypeScript + Tailwind CSS@3 + Vite
- **Initialization Tool**: vite-init
- **Backend**: 无（使用 Mock 数据）
- **Database**: 本地存储 LocalStorage
- **图表库**: Recharts
- **状态管理**: Zustand
- **路由**: React Router v6
- **图标**: Lucide React

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| / | 首页仪表板 |
| /devices | 设备管理 |
| /control | 设备控制 |
| /monitor | 数据监控 |
| /scenes | 智能场景 |
| /platform | 平台管理 |

## 4. API Definitions
无后端 API，使用 Mock 数据

## 5. Server Architecture Diagram
无后端服务器

## 6. Data Model

### 6.1 Data Model Definition

```mermaid
erDiagram
    DEVICE ||--o{ DEVICE_DATA : generates
    DEVICE ||--o{ ALERT : triggers
    SCENE ||--o{ SCENE_ACTION : contains
    USER ||--o{ DEVICE : manages
    USER ||--o{ SCENE : creates
    
    DEVICE {
        string id
        string name
        string type
        string status
        object location
        number battery
        boolean online
    }
    
    DEVICE_DATA {
        string id
        string deviceId
        number temperature
        number humidity
        number value
        string timestamp
    }
    
    ALERT {
        string id
        string deviceId
        string type
        string message
        string level
        string status
        string timestamp
    }
    
    SCENE {
        string id
        string name
        string description
        boolean enabled
        array triggers
        array actions
    }
    
    SCENE_ACTION {
        string id
        string sceneId
        string deviceId
        string action
        object params
    }
    
    USER {
        string id
        string username
        string role
        string email
    }
```

### 6.2 Data Definition Language
无数据库，使用 LocalStorage 存储
