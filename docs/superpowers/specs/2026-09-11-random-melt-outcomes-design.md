# Random Melt Outcomes Design

## Goal

Make the second melt confirmation playful and replayable by resolving it as a 30% success / 70% failure event.

## Interaction

- The first press while frozen changes `녹이기` to `진짜 녹이기` as before.
- The second press chooses one outcome.
- Success has a 30% probability. The status announces `녹이기 성공!` and the existing 4–10 second melting sequence begins.
- Failure has a 70% probability. The pack shakes briefly, stays fully frozen, and shows one of the approved failure messages.
- After a short locked feedback moment, the button returns to `녹이기`, allowing another attempt.
- The same failure message must not appear twice in a row.
- Result text is delivered through the existing polite live region.

## Failure Messages

1. 전자레인지가 고장났어요
2. 냄비가 불에 탔어요
3. 물이 전부 졸아버렸어요
4. 가스불이 꺼졌어요
5. 타이머를 깜빡했어요
6. 온도가 조금 모자랐어요
7. 주방 요정이 오늘 휴가예요
8. 눈사람이 아직 녹기 싫대요
9. 뚜껑이 감쪽같이 사라졌어요
10. 핫팩이 이번엔 버텨냈어요

## Constraints

- Keep the current snowman artwork, disc movement, tilt input, crystallization, and reset behavior unchanged.
- Do not add dependencies or split the standalone HTML file.
- Reduced-motion users receive the state change without relying on animation.
