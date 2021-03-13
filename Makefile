APPID:=wxd9a579680f0a7754
VERSION=${shell sed -n '1p' VERSION.txt}  # VERSION=${shell cat VERSION.txt 2> /dev/null}
DESCRIPTION=${shell sed -n '2p' VERSION.txt}
DEFAULT_ENV=${shell sed -n '6p' ./miniprogram/config.js | sed "s/.*'\([a-z]*\)'.*/\1/g"}

# 上传微信代码
test:
	@$(call uploadWeixin,test,测试版本：,3);
pre:
	@$(call uploadWeixin,pre,预上线版本：,2);
release:
	@$(call uploadWeixin,release,,1);
# 上传微信方法，参数说明（环境变量，描述前缀，机器人编号）
define uploadWeixin
	echo "============ 上传微信-$(1) ============"
	echo 'default env is: ' ${DEFAULT_ENV}
	sed -i'.bak' '6s/${DEFAULT_ENV}/$(1)/' ./miniprogram/config.js
	# 读取配置文件中修改后的变量字段，校验是否更改正确
	echo 'current env is:' && sed -n "6p" ./miniprogram/config.js | sed "s/.*'\([a-z]*\)'.*/\1/g"
	which miniprogram-ci || npm install -g miniprogram-ci
	miniprogram-ci upload \
		--pp ./ \
		--pkp ./private.${APPID}.key \
		--appid ${APPID} \
		--uv ${VERSION} \
		--ud $(2)${DESCRIPTION} \
		-r $(3) \
		--enable-es6 true
	sed -i'.bak' '6s/$(1)/dev/' ./miniprogram/config.js
	rm ./miniprogram/config.js.bak
endef

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
