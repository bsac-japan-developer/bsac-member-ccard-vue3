import pino from 'pino';
import store from '@/store';

// ロガーの作成
const logger = pino({
  level: store.getters['env/logLevel'], // デフォルトのログレベルを設定
  transport: {
    target: 'pino-pretty', // ログを見やすくフォーマット
    options: {
      colorize: true, // カラー出力を有効化
      translateTime: 'SYS:standard', // タイムスタンプを標準形式で表示
    },
  },
});

export default logger;
