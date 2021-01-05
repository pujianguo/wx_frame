APPID:=wxd9a579680f0a7754
VERSION=${shell sed -n '1p' VERSION.txt}  # VERSION=${shell cat VERSION.txt 2> /dev/null}
DESCRIPTION=${shell sed -n '2p' VERSION.txt}

# 测试
test:
	sed -i '' '6s/dev/test/' ./miniprogram/config.js
	miniprogram-ci \
		upload \
		--pp ./ \
		--pkp ./private.${APPID}.key \
		--appid ${APPID} \
		--uv ${VERSION} \
		--ud 测试版本：${DESCRIPTION} \
		-r 3 \
		--enable-es6 true
	sed -i '' '6s/test/dev/' ./miniprogram/config.js

# 预上线
pre:
	sed -i '' '6s/dev/pre/' ./miniprogram/config.js
	miniprogram-ci \
		upload \
		--pp ./ \
		--pkp ./private.${APPID}.key \
		--appid ${APPID} \
		--uv ${VERSION} \
		--ud 预上线版本：${DESCRIPTION} \
		-r 2 \
		--enable-es6 true
	sed -i '' '6s/pre/dev/' ./miniprogram/config.js

# 正式版本
release:
	sed -i '' '6s/dev/release/' ./miniprogram/config.js
	miniprogram-ci \
		upload \
		--pp ./ \
		--pkp ./private.${APPID}.key \
		--appid ${APPID} \
		--uv ${VERSION} \
		--ud ${DESCRIPTION} \
		-r 1 \
		--enable-es6 true
	sed -i '' '6s/release/dev/' ./miniprogram/config.js


# 只有 preview 模式才能展示二维码
preview:
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
