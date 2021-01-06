APPID:=wxd9a579680f0a7754
VERSION=${shell sed -n '1p' VERSION.txt}  # VERSION=${shell cat VERSION.txt 2> /dev/null}
DESCRIPTION=${shell sed -n '2p' VERSION.txt}

env:
	npm install

# 测试
test:
	sed -i'.bak' '6s/dev/test/' ./miniprogram/config.js
	which miniprogram-ci || npm install -g miniprogram-ci
	miniprogram-ci \
		upload \
		--pp ./ \
		--pkp ./private.${APPID}.key \
		--appid ${APPID} \
		--uv ${VERSION} \
		--ud 测试版本：${DESCRIPTION} \
		-r 3 \
		--enable-es6 true
	sed -i'.bak' '6s/test/dev/' ./miniprogram/config.js
	rm ./miniprogram/config.js.bak

# 预上线
pre:
	sed -i'.bak' '6s/dev/pre/' ./miniprogram/config.js
	which miniprogram-ci || npm install -g miniprogram-ci
	miniprogram-ci \
		upload \
		--pp ./ \
		--pkp ./private.${APPID}.key \
		--appid ${APPID} \
		--uv ${VERSION} \
		--ud 预上线版本：${DESCRIPTION} \
		-r 2 \
		--enable-es6 true
	sed -i'.bak' '6s/pre/dev/' ./miniprogram/config.js
	rm ./miniprogram/config.js.bak

# 正式版本
release:
	sed -i'.bak' '6s/dev/release/' ./miniprogram/config.js
	which miniprogram-ci || npm install -g miniprogram-ci
	miniprogram-ci \
		upload \
		--pp ./ \
		--pkp ./private.${APPID}.key \
		--appid ${APPID} \
		--uv ${VERSION} \
		--ud ${DESCRIPTION} \
		-r 1 \
		--enable-es6 true
	sed -i'.bak' '6s/release/dev/' ./miniprogram/config.js
	rm ./miniprogram/config.js.bak

# 只有 preview 模式才能展示二维码
preview:
	which miniprogram-ci || npm install -g miniprogram-ci
	miniprogram-ci \
		preview \
		--pp ./ \
		--pkp ./private.${APPID}.key \
		--appid ${APPID} \
		--uv ${VERSION} \
		--ud ${DESCRIPTION} \
		-r 5 \
		--enable-es6 true \
		--qrcode-format terminal
