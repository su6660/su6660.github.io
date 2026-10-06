# -*- coding: utf-8 -*-
"""将电子信息专升本12章公式渲染为高清PNG，并生成图册博文正文片段。"""
import sys, os, json
_PYLIBS = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".pylibs")
if os.path.isdir(_PYLIBS):
    sys.path.insert(0, _PYLIBS)
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# 仓库内自包含路径：以本脚本位置（tools/formulas/）定位仓库根，换电脑克隆后可直接运行
HERE = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
ARCHIVE_ROOT = os.path.join(HERE, "公式图片归档")
BLOG_IMG_ROOT = os.path.join(REPO_ROOT, "source", "img", "formulas")
BODY_MD = os.path.join(HERE, "formulas_atlas_body.md")
MANIFEST = os.path.join(HERE, "manifest.json")

# 每条：(序号, 名称, mathtext公式)
CHAPTERS = [
    (1, "直流电路基础与基本定律", "第一部分　电路分析", [
        ("欧姆定律", r"$U = I R$"),
        ("全电路欧姆定律", r"$I = \frac{E}{R + r}$"),
        ("电源端电压", r"$U = E - I r$"),
        ("电阻功率（三种形式）", r"$P = U I = I^{2} R = \frac{U^{2}}{R}$"),
        ("基尔霍夫电流定律 KCL", r"$\sum I_{\mathrm{in}} = \sum I_{\mathrm{out}}$"),
        ("基尔霍夫电压定律 KVL", r"$\sum U = 0$"),
        ("电位差", r"$U_{ab} = V_a - V_b$"),
    ]),
    (2, "电路分析方法与电路定理", None, [
        ("电阻串联等效", r"$R = R_1 + R_2$"),
        ("电阻并联等效", r"$R = \frac{R_1 R_2}{R_1 + R_2}$"),
        ("串联分压公式", r"$U_k = \frac{R_k}{R}\, U$"),
        ("并联分流公式", r"$I_1 = \frac{R_2}{R_1 + R_2}\, I$"),
        ("电压源与电流源等效", r"$I_s = \frac{E}{r}$"),
        ("戴维南等效电路电流", r"$I = \frac{U_{\mathrm{oc}}}{R_{\mathrm{eq}} + R}$"),
        ("诺顿短路电流", r"$I_{\mathrm{sc}} = \frac{U_{\mathrm{oc}}}{R_{\mathrm{eq}}}$"),
        ("最大功率传输", r"$P_{\max} = \frac{U_{\mathrm{oc}}^{2}}{4 R_{\mathrm{eq}}}$"),
    ]),
    (3, "一阶动态电路与暂态分析", None, [
        ("电容伏安关系", r"$i = C\, \frac{du}{dt}$"),
        ("电感伏安关系", r"$u = L\, \frac{di}{dt}$"),
        ("换路定律", r"$u_C(0_+) = u_C(0_-),\quad i_L(0_+) = i_L(0_-)$"),
        ("RC 电路时间常数", r"$\tau = R C$"),
        ("RL 电路时间常数", r"$\tau = \frac{L}{R}$"),
        ("RC 零输入响应", r"$u_C(t) = U_0\, e^{-t/\tau}$"),
        ("RL 零输入响应", r"$i_L(t) = I_0\, e^{-t/\tau}$"),
        ("RC 零状态充电", r"$u_C(t) = U_s \left(1 - e^{-t/\tau}\right)$"),
        ("三要素法通式", r"$f(t) = f(\infty) + \left[f(0_+) - f(\infty)\right] e^{-t/\tau}$"),
    ]),
    (4, "正弦稳态电路分析", None, [
        ("正弦量有效值", r"$U = \frac{U_m}{\sqrt{2}}$"),
        ("角频率", r"$\omega = 2\pi f$"),
        ("相位差", r"$\varphi = \varphi_1 - \varphi_2$"),
        ("感抗", r"$X_L = \omega L = 2\pi f L$"),
        ("容抗", r"$X_C = \frac{1}{\omega C} = \frac{1}{2\pi f C}$"),
        ("复阻抗", r"$Z = R + jX$"),
        ("阻抗模", r"$|Z| = \sqrt{R^{2} + X^{2}}$"),
        ("阻抗角", r"$\varphi = \arctan \frac{X}{R}$"),
        ("视在功率", r"$S = U I$"),
        ("有功功率", r"$P = U I \cos\varphi$"),
        ("无功功率", r"$Q = U I \sin\varphi$"),
        ("功率三角形", r"$S^{2} = P^{2} + Q^{2}$"),
        ("串联谐振频率", r"$f_0 = \frac{1}{2\pi\sqrt{L C}}$"),
        ("品质因数", r"$Q = \frac{U_L}{U} = \frac{\omega_0 L}{R}$"),
    ]),
    (5, "半导体器件基础", "第二部分　模拟电子技术", [
        ("三极管电流放大", r"$I_C = \beta I_B$"),
        ("发射极电流", r"$I_E = (1 + \beta)\, I_B$"),
        ("发射结导通压降", r"$U_{BE} \approx 0.7\,\mathrm{V}$"),
        ("饱和压降", r"$U_{CES} \approx 0.3\,\mathrm{V}$"),
    ]),
    (6, "基本放大电路", None, [
        ("分压偏置基极电位", r"$U_B \approx U_{CC}\, \frac{R_{B2}}{R_{B1} + R_{B2}}$"),
        ("发射极电流", r"$I_E \approx \frac{U_B - U_{BE}}{R_E}$"),
        ("基极电流", r"$I_B = \frac{I_C}{\beta}$"),
        ("管压降", r"$U_{CE} \approx U_{CC} - I_C (R_C + R_E)$"),
        ("晶体管输入电阻", r"$r_{be} \approx 300\,\Omega + (1+\beta)\frac{26\,\mathrm{mV}}{I_{EQ}}$"),
        ("共射电压放大倍数", r"$A_u = -\frac{\beta {R^{\prime}}_{L}}{r_{be}},\quad {R^{\prime}}_{L} = R_C \parallel R_L$"),
        ("共射输出电阻", r"$R_o \approx R_C$"),
    ]),
    (7, "放大电路中的负反馈", None, [
        ("闭环增益", r"$A_f = \frac{A}{1 + A F}$"),
        ("深度负反馈增益", r"$A_f \approx \frac{1}{F}$"),
        ("电压串联负反馈", r"$A_{uf} = \frac{u_o}{u_i} \approx \frac{R_1 + R_f}{R_1}$"),
    ]),
    (8, "集成运算放大器及其应用", None, [
        ("虚短与虚断", r"$u_+ = u_- ,\quad i_+ = i_- = 0$"),
        ("反相比例运算", r"$u_o = -\frac{R_f}{R_1}\, u_i$"),
        ("同相比例运算", r"$u_o = \left(1 + \frac{R_f}{R_1}\right) u_i$"),
        ("电压跟随器", r"$u_o = u_i$"),
        ("反相加法运算", r"$u_o = -R_f \left(\frac{u_{i1}}{R_1} + \frac{u_{i2}}{R_2}\right)$"),
        ("减法运算", r"$u_o = \frac{R_f}{R_1}(u_{i2} - u_{i1})$"),
        ("积分运算", r"$u_o = -\frac{1}{RC}\int u_i\, dt$"),
        ("微分运算", r"$u_o = -RC\, \frac{du_i}{dt}$"),
    ]),
    (9, "数制码制与逻辑代数", "第三部分　数字电子技术", [
        ("摩根定律（一）", r"$(AB)^{\prime} = A^{\prime} + B^{\prime}$"),
        ("摩根定律（二）", r"$(A+B)^{\prime} = A^{\prime} B^{\prime}$"),
        ("吸收律（一）", r"$A + AB = A$"),
        ("吸收律（二）", r"$A + A^{\prime} B = A + B$"),
        ("异或运算", r"$A \oplus B = A^{\prime} B + A B^{\prime}$"),
    ]),
    (10, "门电路与组合逻辑电路", None, [
        ("74LS138 译码器实现函数", r"$F = (Y_1 \cdot Y_3 \cdot Y_5 \cdot Y_7)^{\prime}$"),
        ("74LS151 数据选择器实现函数", r"$F = \sum (D_i\, m_i)$"),
    ]),
    (11, "触发器与时序逻辑电路", None, [
        ("JK 触发器特性方程", r"$Q^{n+1} = J\,(Q^n)^{\prime} + K^{\prime}\, Q^n$"),
        ("D 触发器特性方程", r"$Q^{n+1} = D$"),
        ("T 触发器特性方程", r"$Q^{n+1} = T \oplus Q^n$"),
        ("T′ 触发器（翻转）", r"$Q^{n+1} = (Q^n)^{\prime}$"),
        ("D 转 T′ 触发器接法", r"$D = Q^{\prime}$"),
    ]),
    (12, "数模与模数转换电路", None, [
        ("ADC 最小分辨电压", r"$1\,\mathrm{LSB} = \frac{U_{FS}}{2^{n}}$"),
        ("DAC 最小步进电压", r"$\Delta = \frac{U_{FS}}{2^{n} - 1}$"),
        ("采样定理", r"$f_s \geq 2 f_{\max}$"),
        ("DAC 输出电压", r"$u_o = \frac{D}{2^{n} - 1}\, U_{\mathrm{ref}}$"),
    ]),
]

def render(tex, path):
    fig = plt.figure(figsize=(0.13, 0.13), dpi=220)
    fig.text(0, 0, tex, fontsize=26, color="black")
    fig.savefig(path, dpi=220, bbox_inches="tight", pad_inches=0.12,
                facecolor="white", edgecolor="none")
    plt.close(fig)

manifest = []
body_lines = []
total = 0
for num, name, part, items in CHAPTERS:
    if part:
        body_lines.append(f"\n# {part}\n")
    body_lines.append(f"\n## 第{num}章 {name}\n")
    ch = f"ch{num:02d}"
    arc_dir = os.path.join(ARCHIVE_ROOT, f"第{num:02d}章-{name}")
    blog_dir = os.path.join(BLOG_IMG_ROOT, ch)
    os.makedirs(arc_dir, exist_ok=True)
    os.makedirs(blog_dir, exist_ok=True)
    for seq, (cap, tex) in enumerate(items, 1):
        fn = f"{ch}-{seq:02d}.png"
        arc_path = os.path.join(arc_dir, fn)
        blog_path = os.path.join(blog_dir, fn)
        render(tex, arc_path)
        render(tex, blog_path)
        total += 1
        manifest.append({"chapter": num, "chapter_name": name, "seq": seq,
                         "caption": cap, "formula": tex, "file": fn})
        body_lines.append(f"\n**公式 {num}-{seq}　{cap}**\n")
        body_lines.append(f"\n![{cap}](/img/formulas/{ch}/{fn})\n")

with open(MANIFEST, "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=1)
with open(BODY_MD, "w", encoding="utf-8") as f:
    f.write("\n".join(body_lines))

print(f"渲染完成：共 {total} 个公式，{len(CHAPTERS)} 章")
print("归档目录：", ARCHIVE_ROOT)
print("博客图片目录：", BLOG_IMG_ROOT)
print("图册正文片段：", BODY_MD)
