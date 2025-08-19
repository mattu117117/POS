# EventPOS: A Simple POS System for Events
<img width="2868" height="1452" alt="image" src="https://github.com/user-attachments/assets/69bc5e06-12ac-477a-9148-c9fa55011bf8" />
<img width="2860" height="1442" alt="image" src="https://github.com/user-attachments/assets/aecd007c-703f-4e50-a714-a6ceff09c325" />
<img width="2826" height="1443" alt="image" src="https://github.com/user-attachments/assets/7748c8d6-dbf2-4c61-8576-100d0f77e6df" />
<img width="2829" height="1442" alt="image" src="https://github.com/user-attachments/assets/dc59542a-ff82-4458-b41f-6ca58cd54b08" />


-----

## Overview

This is a simple, intuitive, web-based POS (Point of Sale) system designed for small-scale events like school festivals and bake sales.

Developed to make festival operations smoother and more enjoyable, this system provides three dedicated screens for each role: cashier, kitchen staff, and event administrator, enabling seamless real-time information sharing.

No special software installation is required. Anyone can easily start using the system from a browser on a single PC running Node.js.

-----

## Features

### 💻 Register Screen (`index.html`)

The main screen for cashiers.

  * **Intuitive Product Selection:** Easily add items to the cart with a single tap.
  * **Quantity Adjustment:** Intuitively change item quantities in the cart using "+" and "-" buttons.
  * **Discount Functionality:** Apply discounts to each transaction.
  * **Checkout Process:** Upon checkout, order data is sent to the Kitchen and Admin screens in real-time.

### 🍳 Kitchen Display (`kitchen.html`)

The display for kitchen and preparation staff.

  * **Real-time Order Feed:** New orders are added to the list in real-time.
  * **Filtering System:** Filter orders by specific products (e.g., show only "Takoyaki" or "Popcorn").
  * **Completion Check:** Mark items as "served" to clear them from the list and update their status.
  * **Audio Notifications:** A sound alert plays when a new order that matches the current filter settings comes in.

### 📊 Admin Panel (`admin.html`)

A dashboard for event administrators to manage sales and products.

  * **Real-time Sales History:** View all transaction histories, updated in real-time.
  * **Detailed View:** Click on any transaction to expand an accordion view showing detailed item information (name, price, quantity, subtotal).
  * **Product Management:** Add or delete products and set their corresponding button colors.
  * **Bulk Deletion:** Delete all sales data within a specified date and time range to reset records.
  * **CSV Data Export:** Download all sales data as a CSV file for easy accounting and reporting.

-----

## Tech Stack

  * **Backend:** Node.js, Express
  * **Frontend:** HTML, CSS, JavaScript (Vanilla JS)
  * **Data Store:** JSON files

-----

## Getting Started

Follow these steps to run the project in your local environment.

1.  **Clone the repository:**

    ```bash
    git clone https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories
    ```

2.  **Navigate to the directory:**

    ```bash
    cd EventPOS
    ```

3.  **Install the necessary packages:**

    ```bash
    npm install
    ```

4.  **Start the server:**

    ```bash
    node server.js
    ```

5.  **Access in your browser:**
    Once the server is running, open your browser and navigate to the following URLs:

      * **Register Screen:** `http://localhost:3000`
      * **Kitchen Display:** `http://localhost:3000/kitchen.html`
      * **Admin Panel:** `http://localhost:3000/admin.html`

-----

## Future Improvements

Ideas for enhancing this project for more robust use.

  * **Database Integration:** Migrate from the current JSON file data management to a more stable lightweight database like **SQLite** to prevent data corruption from concurrent access.
  * **Inventory Management:** Add a feature to track stock levels for each product and disable selection on the register screen when an item is sold out.
  * **Product Editing:** Implement functionality to edit the name and price of existing products from the admin panel.
  * **Sales Analytics Dashboard:** Create a dashboard in the admin panel to visualize sales data with charts for hourly sales, top-selling items, etc.

-----

## License

This project is licensed under the MIT License.

-----

## Author

  * [mattu117117]
If you find this project useful, please consider giving it a star (★)!


-----

-----

# イベント向けPOSレジシステム (EventPOS)

<img width="2868" height="1452" alt="image" src="https://github.com/user-attachments/assets/69bc5e06-12ac-477a-9148-c9fa55011bf8" />
<img width="2860" height="1442" alt="image" src="https://github.com/user-attachments/assets/aecd007c-703f-4e50-a714-a6ceff09c325" />
<img width="2826" height="1443" alt="image" src="https://github.com/user-attachments/assets/7748c8d6-dbf2-4c61-8576-100d0f77e6df" />
<img width="2829" height="1442" alt="image" src="https://github.com/user-attachments/assets/dc59542a-ff82-4458-b41f-6ca58cd54b08" />

-----

## 概要

このPOSシステムは、学園祭の運営をよりスムーズに、そして楽しくすることを目指して開発されました。主な利用者は、会計担当者、調理担当者、そして運営管理者です。それぞれの役割に応じた3つの画面を提供し、リアルタイムでの情報共有を実現します。

特別なソフトウェアのインストールは不要で、Node.jsが動作するPCが一台あれば、ブラウザから誰でも簡単に利用を開始できます。

-----

## 主な機能

### 💻 レジ画面 (`index.html`)

会計担当者が使用するメイン画面です。

  * **直感的な商品選択:** 商品をタップするだけでカートに簡単に追加できます。
  * **数量変更:** カート内で商品の数量を「+」「-」ボタンで直感的に変更できます。
  * **割引機能:** 会計ごとに割引額を適用できます。
  * **会計完了処理:** 会計完了後、注文データはキッチン画面と管理画面にリアルタイムで送信されます。

### 🍳 キッチン画面 (`kitchen.html`)

調理担当者が使用するディスプレイです。

  * **リアルタイム注文表示:** 新しい注文がリアルタイムでリストに追加されます。
  * **フィルタリング機能:** 「たこ焼き」「ポップコーン」など、商品ごとに表示する注文を絞り込めます。
  * **調理完了チェック:** 提供済みの商品をチェックしてリストから消し、管理画面に情報を反映します。
  * **音声通知機能:** フィルターで絞り込んでいる商品を含む新しい注文が入ると、通知音が鳴ってお知らせします。

### 📊 管理画面 (`admin.html`)

運営管理者が売上や商品を管理するための画面です。

  * **リアルタイム会計履歴:** 全ての会計履歴がリアルタイムで更新・表示されます。
  * **詳細表示:** 各会計をクリックすると、販売した商品の詳細（品名、単価、数量、小計）がアコーディオン形式で展開されます。
  * **商品管理:** 販売する商品の追加・削除、およびボタンの色の設定が可能です。
  * **範囲指定での一括削除:** 指定した期間の会計履歴をまとめて削除し、データをリセットできます。
  * **CSVデータのエクスポート:** 全ての売上データをCSVファイルとしてダウンロードでき、会計報告に利用できます。

-----

## 使用技術

  * **バックエンド:** Node.js, Express
  * **フロントエンド:** HTML, CSS, JavaScript (Vanilla JS)
  * **データストア:** JSONファイル

-----

## セットアップ手順

このプロジェクトをローカル環境で動かすための手順です。

1.  **リポジトリをクローン:**

    ```bash
    git clone [このリポジトリのURL]
    ```

2.  **ディレクトリに移動:**

    ```bash
    cd EventPOS
    ```

3.  **必要なパッケージをインストール:**

    ```bash
    npm install
    ```

4.  **サーバーを起動:**

    ```bash
    node server.js
    ```

5.  **ブラウザでアクセス:**
    サーバーが起動したら、お使いのブラウザで以下のURLにアクセスしてください。

      * **レジ画面:** `http://localhost:3000`
      * **キッチン画面:** `http://localhost:3000/kitchen.html`
      * **管理画面:** `http://localhost:3000/admin.html`

-----

## 今後の課題・改善点

このプロジェクトをさらに本格的に運用するための、将来的な改善案です。

  * **データベースの導入:** 現在のJSONファイルによるデータ管理から、データの安全性が高い**SQLite**などの軽量データベースへの移行。
  * **在庫管理機能:** 各商品の在庫数を管理し、売り切れ時にレジ画面で選択不可にする機能。
  * **商品編集機能:** 登録済みの商品の価格や名前を後から編集する機能。
  * **売上分析ダッシュボード:** 管理画面に、時間帯別の売上グラフや商品別の売上ランキングなどを表示する機能。

-----

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

-----

## 作者

  * [mattu117117]
このプログラムを参考・利用された方は、スター (★) を押していただけると嬉しいです！
