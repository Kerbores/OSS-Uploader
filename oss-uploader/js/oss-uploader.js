$.fn.ossuploader = function(options) {
	$(this).find('input[type="file"]').css('position', 'absolute').css('top', '0').css('rigth', '0').css('margin', '0').css('opacity', '0').css('-ms-filter', 'alpha(opacity=0)').css('direction', 'ltr').css('cursor', 'pointer').height($(this).get(0).offsetHeight).width($(this).get(0).offsetWidth); // 样式处理
	var df = {
		credUrl: '', // oss 验证信息的获取 url
		uuid: function() { // uuid 产生
			var s = [];
			var hexDigits = "0123456789abcdef";
			for(var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4";
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
			s[8] = s[13] = s[18] = s[23] = "";
			var uuid = s.join("");
			return uuid;
		},
		done: function(result) { // 完成
			console.log(result);
		},
		progress: function(p) {
			console.log(p);
		},
		error: function(err) { // 错误
			console.log(err);
		}
	};
	$.extend(df, options); // 参数处理
	var client;

	$(this).on('click', function() {
		if(!client) { // 没有初始化即可初始化 oss 上传 client
			$.get(df.credUrl, function(result) {
				client = new OSS.Wrapper({ // 获取 oss 相关的信息并创建 client
					region: result.region,
					accessKeyId: result.accessKeyId,
					accessKeySecret: result.accessKeySecret,
					bucket: result.bucket
				});
			});
		}
	});
	$(this).find('input[type="file"]').on('change', function() {
		if(!client) {
			df.error('client init fail or still initing');
		}
		client.multipartUpload(df.uuid.apply(), this.files[0], {
			progress: function*(p) {
				df.progress(p);
			}
		}).then(df.done).catch(df.error);
	})
}