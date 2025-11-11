        document.addEventListener('DOMContentLoaded', function() {
            // 获取所有角色卡片
            const cards = document.querySelectorAll('.role-card, .role-card-wrapper2');
            
            // 为每个卡片添加点击事件
            cards.forEach(card => {
                card.addEventListener('click', function() {
				  // 移除所有卡片的 active 类
				cards.forEach(c => c.classList.remove('active'));

				  // 为当前卡片添加 active 类（触发效果）
				this.classList.add('active')

                });
            });
            
            // 添加键盘事件支持
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    cards.forEach(card => card.classList.remove('active'));
                }
            });
        });