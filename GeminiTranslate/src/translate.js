load("language_list.js"); 

function execute(text, from, to, apiKey1) {
    let apiKey = "AIzaSyAdkzC808lOggmCka4psJPPbBk14oKiVa4"
    if (!apiKey) {
        return Response.success("");
    }

    const system_prompt = `Mục tiêu: Chuyển ngữ hoặc sáng tạo lại văn bản, đảm bảo duy trì tối đa văn phong, nội dung và cảm xúc gốc, đồng thời phù hợp với các quy tắc ngôn ngữ và phong cách đã định.
Yêu cầu chi tiết:
Văn phong, Nội dung & Cảm xúc: Đảm bảo giữ nguyên vẹn văn phong, truyền tải đầy đủ nội dung và cảm xúc sâu sắc của các nhân vật.
Tính Lôi Cuốn: Văn bản dịch/sáng tạo phải lôi cuốn, hấp dẫn người đọc và khắc họa rõ nét tình cảm trong văn bản gốc.
Độ Chính Xác: Đảm bảo truyền tải đầy đủ, chính xác mọi ý nghĩa, thông tin và chi tiết cốt lõi của văn bản gốc, không lược bỏ bất kỳ ý tứ quan trọng nào.
Đại Từ Nhân Xưng:
Đối với chuyển ngữ từ zh-Hans sang vi: Ưu tiên sử dụng các đại từ nhân xưng cổ phong như "ta", "ngươi", "hắn", "nàng". Tuyệt đối không dùng các từ như "cô ta", "anh ta".
Đối với các trường hợp khác: Các đại từ nhân xưng phải phù hợp với hoàn cảnh, không khí và mối quan hệ của nhân vật trong văn bản.
Tên Nhân Vật: Tên của nhân vật phải được dịch sang Hán Việt (nếu từ zh-Hans) và có tính đồng nhất trong toàn bộ văn bản.
Chế độ Chuyển ngữ/Sáng tạo:
Khi chuyển ngữ từ zh-Hans sang vi: Thực hiện dịch thuật theo các tiêu chuẩn trên.
Khi chuyển ngữ từ vi sang vi: Sáng tạo lại nội dung dựa trên cốt truyện, cảm xúc, thông điệp và văn phong gốc. Bản sáng tạo phải mang tính độc đáo nhưng vẫn tuân thủ tất cả các tiêu chí đã nêu.
Định dạng đầu ra: Chỉ trả về văn bản đã được dịch hoặc sáng tạo, không thêm bất kỳ lời giải thích hay ghi chú nào khác trong bất cứ trường hợp nào. Nếu đầu vào là trống, trả lời bằng một dấu ?, không trả lời bằng bất kỳ cách thức khác.`;

    const full_prompt = `---\n${text}\n---\n\nDịch văn bản trên từ '${from}' sang '${to}' ${system_prompt}`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent?key=${apiKey}`;

    const body = {
        "contents": [{ "parts": [{ "text": full_prompt }] }],
        "generationConfig": {
            "temperature": 0.5, "topK": 1, "topP": 1, "maxOutputTokens": 8192, "stopSequences": []
        },
        "safetySettings": [
            { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE" },
            { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE" },
            { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE" },
            { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE" }
        ]
    };

    let response = fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (response.ok) {
        let result = JSON.parse(response.text());

        if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts[0]) {
            let translatedBlock = result.candidates[0].content.parts[0].text;

            let lines = translatedBlock.split('\n');
            let trans = "";
            lines.forEach(line => {
                trans += line + "\n";
            });
            
            return Response.success(trans.trim());

        } else {
            return Response.success("");
        }
    } else {
        return Response.success("");
    }
}