---
title: "🦋 Augmentation과 전처리의 실전 필요성"
excerpt: "곤충 분류 모델 예시로 데이터 증강(Augmentation)이 왜 필요한지 설명하고, 실무에서 전처리를 어떻게 바라봐야 하는지를 비교합니다."
categories: [planning]
tags: [augmentation, preprocessing, data]
layout: single
toc: true
toc_label: "On this page"
toc_sticky: true
permalink: /planning/augmentation/
---

## 🦋 Augmentation의 필요성

<img src="/assets/images/2025/DLplanning/augmentation-sample.png" 
     alt="곤충 분류 예시 - Augmentation 샘플" 
     width="700"/>

<small>
출처: <a href="https://www.biorxiv.org/content/10.1101/2024.11.01.621497v1.full" target="_blank" rel="noopener noreferrer">
BioRxiv 논문: Augmentation for Insect Species Identification</a>
</small>

---

모델 학습에 **Augmentation**이 필요한 이유를 설명하기 위한 예시로,  
카메라로 곤충을 인식하는 소프트웨어 **AInsectID**를 들 수 있다.

모델이 **호랑나비 사진 한 장만** 학습했다고 가정하자.  
하지만 실제 환경에서는 나비가 다음처럼 다양하게 등장할 수 있다:

- 나뭇잎 위에 비스듬히 앉아 있거나  
- 그늘진 곳에 있거나  
- 날개의 무늬나 색상이 다를 수 있다

이런 변화에 모델이 적응하지 못하면 인식이 실패할 수 있다.

이를 해결하는 방법이 바로 👉 **데이터 증강(Augmentation)**이다.  
회전, 색상 변화, 위치 이동 등으로 데이터를 다양하게 만들어  
모델이 다양한 상황에서도 잘 작동하도록 학습을 돕는다.

---

## 🧠 실무자의 관점에서 보는 전처리

전처리는 **사람과 모델의 관점이 다르다.**

사람은 **깔끔한 이미지**를 선호하지만,  
모델은 **불량의 수치적 특징이 뚜렷한 이미지**를 더 잘 학습한다.

예를 들어, 뿌연 이미지는 사람이 보기엔 불편하지만  
모델에게는 불량이 더 잘 드러날 수 있다.

따라서 전처리는 **사람 기준이 아닌 모델 기준**으로 수행해야 한다.

---

### 🔍 비교 표

| 분류           | 사람 기준       | 모델 기준               | 결론                         |
|----------------|----------------|--------------------------|------------------------------|
| **특징**        | 시각적 편안     | 수치적 인식              | ✅ 모델 기준으로 전처리함     |
| **뿌연 사진**   | 보기 불편       | 불량 특징이 더 두드러짐   | ✅ 모델 선호                  |
| **깔끔한 사진** | 보기 편함       | 특징이 사라짐             | ⚠️ 모델 비선호                |

---

### 🖼️ 예시 이미지

<img src="/assets/images/2025/DLplanning/example-blur.jpg" 
     alt="Blur Example" 
     width="700"/>

<small>
출처: <a href="https://www.manula.com/manuals/fxhome/imerge-pro/2021.5/en/topic/blurs" target="_blank" rel="noopener noreferrer">
FXHome Imerge Pro Manual - Blur Effects</a>
</small>
