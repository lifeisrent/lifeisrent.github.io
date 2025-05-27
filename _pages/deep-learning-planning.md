---
title: "1. 기획 & 데이터 설계"
layout: single
sidebar:
  nav: main
permalink: /projects/deep-learning/planning/
author_profile: true
entries_layout: list
category: planning
toc: true
toc_label: "Contents"
---

## 💡 프로젝트 개요

서론: 머신비전 → 반도체 검사, 자율주행에 활용됨

목표: 반도체 웨이퍼 표면검사에 쓰이는 이미지 처리 알고리즘을 연구

데이터: DAGM 2007 – 난이도가 낮다, 인공 생성된 유사 웨이퍼 이미지

---

## 🧭 문제 정의

이미지 처리 알고리즘은 난이도에 따라 세 분류로 나눌 수 있다. 

| 유형 | 설명 | 난이도 | 추천 기술 및 모델 |
| --- | --- | --- | --- |
| 🧠 분류 (Classification) | 이미지에 불량이 있는지 여부만 판단 | ★☆☆ | `ResNet`, `EfficientNet` |
| 📍 위치 검출 (Detection) | 이미지 내 불량의 위치와 경계 표시 | ★★☆ | `YOLOv5`,  `Faster R-CNN` |
| ⚠️ 이상 감지 (Anomaly Detection) | 정상이 아닌 패턴을 자동 식별
(라벨 없이 비지도 학습) | ★★★ | `AutoEncoder`, `GANomaly` |

## 📂 문제 정의에 따른 데이터 구성 방식의 차이

모델 구조가 다르면 라벨링 방식과 데이터 디렉토리 구조도 달라진다.

분류(Classification) 모델과 검출(Detection) 모델은 서로 다른 방식으로 데이터를 구성해야 한다.

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

---

## 🦋 Augmentation의 필요성

![곤충 분류 예시 - Augmentation 샘플](/assets/images/2025/DLplanning/augmentation-sample.png)

<small>
출처: <a href="https://www.biorxiv.org/content/10.1101/2024.11.01.621497v1.full" target="_blank" rel="noopener noreferrer">
BioRxiv 논문: Augmentation for Insect Species Identification</a>
</small>

---

분류 모델이 Augmentation이 필요한 이유에 대해 설명하기 위해 
곤충을 자동으로 감지하는 소프트웨어 **AInsectID**를 예시로 들겠습니다.
카메라로 촬영된 이미지를 통해 곤충의 종류를 인식하는 프로그램입니다.

예를 들어, 모델이 **호랑나비 사진 한 장만 보고 학습**했다고 가정해보겠습니다.  
하지만 실제 환경에서는 나비가 다음과 같이 다양하게 등장할 수 있습니다:

- 나뭇잎 위에 **비스듬히 앉아 있거나**
- **그늘진 곳**에 있거나  
- **날개의 무늬나 색상이 조금씩 다를 수도** 있습니다

이러한 변화에 모델이 적응하지 못하면 곤충을 인식하지 못하게 됩니다.

그래서 등장하는 것이 바로 👉 **데이터 증강(Augmentation)** 기법입니다.  
이미지를 회전하거나, 색상을 바꾸거나, 위치를 이동시켜  
모델이 다양한 상황에 대응할 수 있도록 학습 데이터를 풍부하게 만드는 과정입니다.


---

## 🧠 실무자의 관점에서 보는 전처리

전처리는 **사람**과 **모델**의 관점이 다릅니다.  
사람은 시각적으로 "깔끔함"을 선호하지만,  
모델은 **불량의 수치적 특징**이 드러나야 잘 학습할 수 있습니다.

### 🔍 비교 표

| 분류           | 사람 기준       | 모델 기준               | 결론                         |
|----------------|----------------|--------------------------|------------------------------|
| **특징**        | 시각적 편안     | 수치적 인식              | ✅ 모델 기준으로 전처리함     |
| **뿌연 사진**   | 보기 불편       | 불량 특징이 더 두드러짐   | ✅ 모델 선호                  |
| **깔끔한 사진** | 보기 편함       | 특징이 사라짐             | ⚠️ 모델 비선호                |

<br>

### 🖼️ 예시 이미지

![Blur Example](/assets/images/2025/DLplanning/example-blur.jpg)

<small>
출처: <a href="https://www.manula.com/manuals/fxhome/imerge-pro/2021.5/en/topic/blurs" target="_blank" rel="noopener noreferrer">
FXHome Imerge Pro Manual - Blur Effects</a>
</small>


---

## 🧾 데이터셋 구성

- Train / Validation / Test 분할 비율을 정하고, 클래스 불균형 문제를 해결해야 한다.
- 교차 검증(K-fold) 전략을 사용할 경우, 데이터 누수(Data Leakage)를 방지할 수 있도록 주의한다.

**고려 포인트**
- 데이터셋 간 도메인 격차(domain drift)를 고려
- 불균형 데이터 처리: 샘플링, 클래스 가중치 등 활용
- 누수 방지: 이미지 중복 여부, 순서 기반 분할 방지

---

향후 "모델링 & 학습 평가", "배포 & 운영" 단계에서 이 기획 내용이 기반이 된다.  
기획 단계에서 탄탄한 구조를 세우는 것이 전체 프로젝트 완성도를 좌우한다.
