# 使用 mermaid 绘制流程图

[annotation]: [id] (06f8ac82-1352-4264-bbd8-3f362e13557b)
[annotation]: [status] (public)
[annotation]: [create_time] (2021-06-11 15:40:35)
[annotation]: [category] (计算机技术)
[annotation]: [tags] ()
[annotation]: [comments] (false)
[annotation]: [url] (http://blog.ccyg.studio/article/06f8ac82-1352-4264-bbd8-3f362e13557b)

## 流程图

```mermaid
graph LR;
    A-->B;
    B-->C;
    C-->D;
    click A callback "Tooltip for a callback"
    click B "http://www.github.com" "This is a tooltip for a link"
    click A call callback_1() "Tooltip for a callback"
    click D href "http://www.github.com" "This is a tooltip for a link"
```

<script>
var callback_1 = function(){
    alert("hello this is a callback");
}
</script>

---

```mermaid
flowchart TB
    C1 --> A2
    subgraph one
        A1 --> A2
    end
    subgraph two
        B1 --> B2
    end
    subgraph three
        C1 --> C2
    end
    one --> two
    two --> three
    three --> one
```

---

```mermaid
flowchart LR
id1(This is the text in the box)
id2[[This is the text in the box]]
id3[(This is the database)]
id4((This is the text in the circle))
id5> This is the text in the box with flag]
id6{This is the text in the diamond}
```

---

```mermaid
flowchart LR
A --> B;
```

```mermaid
flowchart LR
A --- B
```

```mermaid
flowchart LR
A -->|This is the text| B
```

```mermaid
flowchart LR
A -.-> B
C -.text.-> D
```

```mermaid
flowchart LR
A ==> B
C == text ==> D
```

```mermaid
flowchart TD
A[start] --> B{Is it?};
B -->|Yes| C[OK];
C --> D[Rethink];
D --> B;
B --->|No| E[End];
```

---

## 饼图

```mermaid
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```

## Journey

```mermaid
journey
    title 平凡的一天
    section 起床
      醒来: 1: 我
      洗漱: 2: 我
    section 去工作
      坐地铁: 1: 我
      工作: 4: 我, 其他人
    section 中午休息
      吃饭: 5: 我
      看书: 5: 我
      睡觉: 5: 我
    section 工作
      工作: 4: 我, 其他人
    section 放工
      饮茶先: 5: 我
```

## 参考资料

- <https://mermaid-js.github.io/mermaid/>