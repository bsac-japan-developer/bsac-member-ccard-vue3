【ログイン時】
show/{diver_id} を呼び出す

```
{
  latest: true/false,
  message: "xxxx",
  diver_medical: {}
}
```

message が null 以外の場合
ランク画面の上部にメッセージを表示する
リンクをクリックするとダイバーメディカル入力画面に遷移する

【「ダイバーメディカルを登録する」ボタン クリック】

latest: true の場合
edit/{diver_id} を呼び出す

latest: false の場合
new を呼び出す

show/{diver_id}

- diver_user_medicals に登録しているメディカル情報を取得する
- メディカル情報のバージョンを確認する
- 最新版の場合は latest に true、そうでない場合は false をセットする
- 最新版ではない場合 message に「メディカル情報のフォーマットが更新されました。再度登録してください」と表示する
- メディカル情報が存在しない場合、「メディカル情報を入力してください」と表示する

edit/{diver_id}

- diver_user_medicals に登録しているメディカル情報を取得する

new/

-
