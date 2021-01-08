APPID:=wxd9a579680f0a7754
VERSION=${shell sed -n '1p' VERSION.txt}  # VERSION=${shell cat VERSION.txt 2> /dev/null}
DESCRIPTION=${shell sed -n '2p' VERSION.txt}
DEFAULT_ENV=${shell sed -n '6p' ./miniprogram/config.js | sed "s/.*'\([a-z]*\)'.*/\1/g"}

env:
	npm install

# 测试
test:
	echo 'default env is: ' ${DEFAULT_ENV}
	sed -i'.bak' '6s/${DEFAULT_ENV}/test/' ./miniprogram/config.js\
		&& echo 'current env is: '\
		&& sed -n "6p" ./miniprogram/config.js | sed "s/.*'\([a-z]*\)'.*/\1/g"
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
	echo 'default env is: ' ${DEFAULT_ENV}
	sed -i'.bak' '6s/${DEFAULT_ENV}/pre/' ./miniprogram/config.js\
		&& echo 'current env is: '\
		&& sed -n "6p" ./miniprogram/config.js | sed "s/.*'\([a-z]*\)'.*/\1/g"
	echo 'current env is:' ${sed -n "6p" ./miniprogram/config.js | sed "s/.*'\([a-z]*\)'.*/\1/g"}
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
	echo 'default env is: ' ${DEFAULT_ENV}
	sed -i'.bak' '6s/${DEFAULT_ENV}/release/' ./miniprogram/config.js\
		&& echo 'current env is: '\
		&& sed -n "6p" ./miniprogram/config.js | sed "s/.*'\([a-z]*\)'.*/\1/g"
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
	echo 'default env is: ' ${DEFAULT_ENV}
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
