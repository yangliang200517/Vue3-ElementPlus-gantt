export function makeResizable(element) {
    let isDragging = false;
    let startX, startWidth;

    // 添加鼠标指针样式变化
    element.style.cursor = 'default';

    // 鼠标按下时判断是否在右边缘区域
    element.addEventListener('mousedown', (e) => {
        const rect = element.getBoundingClientRect();
        // 检查鼠标是否在元素右边缘 10px 内点击
        if (e.clientX >= rect.right - 10 && e.clientX <= rect.right) {
            isDragging = true;
            startX = e.clientX;
            startWidth = rect.width;
            document.body.style.userSelect = 'none'; // 禁止文本被选中
            element.style.cursor = 'ew-resize'; // 改变鼠标样式为左右拖拽
        }
    });

    // 鼠标移动时调整宽度
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const newWidth = startWidth + (e.clientX - startX);
            // 限制最小宽度，防止元素过窄
            if (newWidth > 50) {
                element.style.width = `${newWidth}px`;
                const rightElement = element.nextElementSibling;
                if (rightElement) {
                    rightElement.style.width = `calc(100% - ${newWidth}px)`;
                }
            }
            element.style.cursor = 'ew-resize';
        } else {
            // 当不是拖动状态时检查鼠标位置并更新指针样式
            const rect = element.getBoundingClientRect();
            if (e.clientX >= rect.right - 10 && e.clientX <= rect.right) {
                element.style.cursor = 'ew-resize';
            } else {
                element.style.cursor = 'default';
            }
        }
    });

    // 鼠标抬起时停止拖拽
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = ''; // 恢复文本选择
            element.style.cursor = 'default'; // 恢复默认鼠标样式
        }
    });
}