export default {
  /**
   * ログを出力する
   */
  output: function (method, header, content) {
    console.debug(
      `via log.js output() - [${method}] ${header}: ${JSON.stringify(
        content,
        (key, value) => {
          if (key.toLowerCase().includes('base64')) return '[BASE64_OMITTED]';
          return value;
        },
        2
      )}`
    );
  },
};
