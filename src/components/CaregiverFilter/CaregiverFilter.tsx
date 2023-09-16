import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { LOCATION_OPTIONS } from "../../types/Constant";

const AGE_OPTIONS = ["18-25", "26-35", "36-45", "46-55", "56+"];
const GENDER_OPTIONS = ["男性", "女性"];
const EXPERIENCE_OPTIONS = ["<1", "1-3", "4-6", "7-10", ">10"];

interface CaregiverFilterProps {
  onFilterChange: (filter: any) => void;
}

const CaregiverFilter: React.FC<CaregiverFilterProps> = ({
  onFilterChange,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [experience, setExperience] = useState("");

  const handleImmediateFilterChange = () => {
    const newFilter = { location, age, gender, experience };

    onFilterChange(newFilter);
    setShowModal(false); // Close the modal after applying the filters
  };

  return (
    <div>
      <Button
        style={{ backgroundColor: "#FF5733", color: "white" }}
        onClick={() => setShowModal(true)}
      >
        筛选
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>筛选选项</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col mb-4">
            <label className="mb-2">
              地点:
              <select
                className="w-1/4"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">选择地点</option>
                {LOCATION_OPTIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-2">
              年龄:
              <select value={age} onChange={(e) => setAge(e.target.value)}>
                <option value="">选择年龄</option>
                {AGE_OPTIONS.map((ageRange) => (
                  <option key={ageRange} value={ageRange}>
                    {ageRange}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-2">
              性别:
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">选择性别</option>
                {GENDER_OPTIONS.map((gen) => (
                  <option key={gen} value={gen}>
                    {gen}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-2">
              工作经验:
              <select
                className="w-1/4"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">选择工作经验</option>
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            关闭
          </Button>
          <Button variant="primary" onClick={handleImmediateFilterChange}>
            展示结果
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CaregiverFilter;
