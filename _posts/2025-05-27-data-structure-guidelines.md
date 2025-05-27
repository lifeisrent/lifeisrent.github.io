---
title: "📂 데이터 구성 방식 가이드: Classification vs Detection"
excerpt: "ResNet과 YOLO 모델의 데이터 구성 차이와 라벨링 방식, 폴더 구조 팁을 정리했습니다."
categories: [planning]
tags: [dataset, labeling, directory]
layout: single
toc: true
toc_label: "Contents"
permalink: /planning/data-structure-guidelines/
---

## 📌 개요

딥러닝 모델의 유형에 따라 **데이터 디렉토리 구조**와 **라벨링 방식**은 달라진다.  
이 글에서는 분류(Classification)와 검출(Detection) 모델의 **데이터 구성 차이와 실전 팁**을 정리한다.

---

### ✅ 모델별 데이터 구성 비교

| 모델 유형 | 예시 모델 | 디렉토리 구조 | 라벨링 방식 |
| --- | --- | --- | --- |
| 🧠 분류 (Classification) | `ResNet` | `data/defect/`, `data/normal/` | 폴더명이 곧 라벨 (`ImageFolder` 방식) |
| 📍 검출 (Detection) | `YOLOv5` | `images/train/`, `labels/train/` + `.txt` or `label.csv` | 바운딩 박스 좌표 + 클래스 번호 필요
(`x,y,w,h,class`) |

---

### 🧪 예시 1: 분류 모델 (ResNet)

```
data/
├── defect/
│   ├── 001.png
│   └── ...
├── normal/
│   ├── 001.png
│   └── ...
```

- `ImageFolder` 사용 시 폴더 이름이 자동으로 클래스(label)로 인식된다.
- 별도의 라벨 파일 없이도 학습 가능하다.

### 🧪 예시 2: 검출 모델 (YOLO)

```
datasets/
├── images/
│   ├── train/
│   ├── val/
├── labels/
│   ├── train/
│   ├── val/
```

- 각 이미지에 대응하는 라벨 파일 (`.txt`) 혹은 `label.csv` 파일이 필요하다.
- YOLO 라벨 예시 (`labels/train/0001.txt`)
    
    ```css
    0 0.45 0.52 0.2 0.1  # class x_center y_center width height
    ```
    
- 좌표는 보통 **정규화된 값(0~1)**으로 표현하지만, 일부 데이터셋은 **절대 좌표(px)**를 사용하기도 하므로 반드시 라벨 형식을 데이터셋 설명에서 확인해야 한다.

**고려 포인트**

### 📁 폴더 구조 확인

두 가지 폴더 구조는 **모델 유형에 따라 다르게 구성**되며,

직접 만들기 전에 **공식 예제나 공개된 데이터셋에서 제공하는 구조**가 있는지 먼저 확인하는 것이 좋다.

- 이미 정리된 구조를 활용하면 라벨링 오류나 경로 설정 문제를 줄일 수 있다.
- 학습 코드와 폴더 구조의 호환성을 높일 수 있다.

{: .notice--tip}

### 🔢 파일 이름 자릿수 통일의 중요성

이미지 파일 이름은 `1`, `23`, `456`보다

`0001`, `0023`, `0456`처럼 **자릿수를 맞춰 정렬**하는 것이 안전하다.

- 정렬 오류를 방지할 수 있다.
- 자동 매칭, 반복 처리 시 예외를 줄일 수 있다.
- 다양한 도구나 라이브러리에서도 일관된 처리가 가능하다.

{: .notice--tip}

